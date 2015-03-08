---
layout: post
title: "读懂Java中的Socket编程"
date: 2015-03-08 16:09
comments: true
categories: Java Socket
---
Socket,又称为套接字，Socket是计算机网络通信的基本的技术之一。如今大多数基于网络的软件，如浏览器，即时通讯工具甚至是P2P下载都是基于Socket实现的。本文会介绍一下基于TCP/IP的Socket编程，并且如何写一个客户端/服务器程序。
<!--more-->
##餐前甜点
Unix的输入输出(IO)系统遵循Open-Read-Write-Close这样的操作范本。当一个用户进程进行IO操作之前，它需要调用Open来指定并获取待操作文件或设备读取或写入的权限。一旦IO操作对象被打开，那么这个用户进程可以对这个对象进行一次或多次的读取或写入操作。Read操作用来从IO操作对象读取数据，并将数据传递给用户进程。Write操作用来将用户进程中的数据传递（写入）到IO操作对象。 当所有的Read和Write操作结束之后，用户进程需要调用Close来通知系统其完成对IO对象的使用。

在Unix开始支持进程间通信（InterProcess Communication，简称IPC）时，IPC的接口就设计得类似文件IO操作接口。在Unix中，一个进程会有一套可以进行读取写入的IO描述符。IO描述符可以是文件，设备或者是通信通道（socket套接字）。一个文件描述符由三部分组成：创建（打开socket），读取写入数据（接受和发送到socket）还有销毁（关闭socket）。

在Unix系统中，类BSD版本的IPC接口是作为TCP和UDP协议之上的一层进行实现的。消息的目的地使用socket地址来表示。一个socket地址是由网络地址和端口号组成的通信标识符。

进程间通信操作需要一对儿socket。进程间通信通过在一个进程中的一个socket与另一个进程中得另一个socket进行数据传输来完成。当一个消息执行发出后，这个消息在发送端的socket中处于排队状态，直到下层的网络协议将这些消息发送出去。当消息到达接收端的socket后，其也会处于排队状态，直到接收端的进程对这条消息进行了接收处理。

##TCP和UDP通信
关于socket编程我们有两种通信协议可以进行选择。一种是数据报通信，另一种就是流通信。

###数据报通信
数据报通信协议，就是我们常说的UDP（User Data Protocol 用户数据报协议）。UDP是一种无连接的协议，这就意味着我们每次发送数据报时，需要同时发送本机的socket描述符和接收端的socket描述符。因此，我们在每次通信时都需要发送额外的数据。

###流通信
流通信协议，也叫做TCP(Transfer Control Protocol，传输控制协议)。和UDP不同，TCP是一种基于连接的协议。在使用流通信之前，我们必须在通信的一对儿socket之间建立连接。其中一个socket作为服务器进行监听连接请求。另一个则作为客户端进行连接请求。一旦两个socket建立好了连接，他们可以单向或双向进行数据传输。

读到这里，我们多少有这样的疑问，我们进行socket编程使用UDP还是TCP呢。选择基于何种协议的socket编程取决于你的具体的客户端-服务器端程序的应用场景。下面我们简单分析一下TCP和UDP协议的区别，或许可以帮助你更好地选择使用哪种。

在UDP中，每次发送数据报时，需要附带上本机的socket描述符和接收端的socket描述符。而由于TCP是基于连接的协议，在通信的socket对之间需要在通信之前建立连接，因此会有建立连接这一耗时存在于TCP协议的socket编程。

在UDP中，数据报数据在大小上有64KB的限制。而TCP中也不存在这样的限制。一旦TCP通信的socket对建立了连接，他们之间的通信就类似IO流，所有的数据会按照接受时的顺序读取。

UDP是一种不可靠的协议，发送的数据报不一定会按照其发送顺序被接收端的socket接受。然后TCP是一种可靠的协议。接收端收到的包的顺序和包在发送端的顺序是一致的。

简而言之，TCP适合于诸如远程登录(rlogin,telnet)和文件传输（FTP）这类的网络服务。因为这些需要传输的数据的大小不确定。而UDP相比TCP更加简单轻量一些。UDP用来实现实时性较高或者丢包不重要的一些服务。在局域网中UDP的丢包率都相对比较低。


##Java中的socket编程
下面的部分我将通过一些示例讲解一下如何使用socket编写客户端和服务器端的程序。

注意：在接下来的示例中，我将使用基于TCP/IP协议的socket编程，因为这个协议远远比UDP/IP使用的要广泛。并且所有的socket相关的类都位于java.net包下，所以在我们进行socket编程时需要引入这个包。



###客户端编写
####开启Socket
如果在客户端，你需要写下如下的代码就可以打开一个socket。
```java
String host = "127.0.0.1";
int port = 8919;
Socket client = new Socket(host, port);
```
上面代码中，host即客户端需要连接的机器，port就是服务器端用来监听请求的端口。在选择端口时，需要注意一点，就是0~1023这些端口都已经被系统预留了。这些端口为一些常用的服务所使用，比如邮件，FTP和HTTP。当你在编写服务器端的代码，选择端口时，请选择一个大于1023的端口。

####写入数据
接下来就是写入请求数据，我们从客户端的socket对象中得到OutputStream对象，然后写入数据后。很类似文件IO的处理代码。
```java
public class ClientSocket {
	public static void main(String args[]) {
        String host = "127.0.0.1";
        int port = 8919;
        try {
	        Socket client = new Socket(host, port);
	        Writer writer = new OutputStreamWriter(client.getOutputStream());
	        writer.write("Hello From Client");
	        writer.flush();
	        writer.close();
	        client.close();
        } catch (IOException e) {
        	e.printStackTrace();
        }
    }
	
}
```
####关闭IO对象
类似文件IO，在读写数据完成后，我们需要对IO对象进行关闭，以确保资源的正确释放。

###服务器端编写
####打开服务器端的socket
```java
int port = 8919; 
ServerSocket server = new ServerSocket(port);
Socket socket = server.accept();
```
上面的代码创建了一个服务器端的socket，然后调用accept方法监听并获取客户端的请求socket。accept方法是一个阻塞方法，在服务器端与客户端之间建立联系之前会一直等待阻塞。

####读取数据
通过上面得到的socket对象获取InputStream对象，然后安装文件IO一样读取数据即可。这里我们将内容打印出来。
```java
public class ServerClient {
	public static void main(String[] args) {
	      int port = 8919; 
	      try {
		      ServerSocket server = new ServerSocket(port); 
			      Socket socket = server.accept(); 
		      Reader reader = new InputStreamReader(socket.getInputStream()); 
		      char chars[] = new char[1024]; 
		      int len; 
		      StringBuilder builder = new StringBuilder(); 
		      while ((len=reader.read(chars)) != -1) { 
		         builder.append(new String(chars, 0, len)); 
		      } 
		      System.out.println("Receive from client message=: " + builder); 
		      reader.close(); 
		      socket.close(); 
		      server.close(); 
	      } catch (Exception e) {
	    	  e.printStackTrace();
	      }
	}
}
```

####关闭IO对象
还是不能忘记的，最后需要正确地关闭IO对象，以确保资源的正确释放。


###附注一个例子
这里我们增加一个例子，使用socket实现一个回声服务器，就是服务器会将客户端发送过来的数据传回给客户端。代码很简单。
```java
import java.io.*;
import java.net.*;
public class EchoServer {
    public static void main(String args[]) {
        // declaration section:
        // declare a server socket and a client socket for the server
        // declare an input and an output stream
        ServerSocket echoServer = null;
        String line;
        DataInputStream is;
        PrintStream os;
        Socket clientSocket = null;
        // Try to open a server socket on port 9999
        // Note that we can't choose a port less than 1023 if we are not
        // privileged users (root)
        try {
           echoServer = new ServerSocket(9999);
        }
        catch (IOException e) {
           System.out.println(e);
        } 
        // Create a socket object from the ServerSocket to listen and accept 
        // connections.
        // Open input and output streams
        try {
               clientSocket = echoServer.accept();
               is = new DataInputStream(clientSocket.getInputStream());
               os = new PrintStream(clientSocket.getOutputStream());
               // As long as we receive data, echo that data back to the client.
               while (true) {
                 line = is.readLine();
                 os.println(line); 
               }
        } catch (IOException e) {
               System.out.println(e);
            }
        }
}
```
编译运行上面的代码，进行如下请求，就可以看到客户端请求携带的数据的内容。
```java
15:00 $ curl http://127.0.0.1:9999/?111
GET /?111 HTTP/1.1
User-Agent: curl/7.37.1
Host: 127.0.0.1:9999
Accept: */*
```

##总结
进行客户端-服务器端编程还是比较有趣的，同时在Java中进行socket编程要比其他语言（如C）要简单快速编写。

java.net这个包里面包含了很多强大灵活的类供开发者进行网络编程，在进行网络编程中，建议使用这个包下面的API。同时Sun.*这个包也包含了很多的网络编程相关的类，但是不建议使用这个包下面的API，因为这个包可能会改变，另外这个包不能保证在所有的平台都有包含。

##原文信息
  * 原文地址：[Sockets programming in Java: A tutorial](http://www.javaworld.com/article/2077322/core-java/core-java-sockets-programming-in-java-a-tutorial.html?null)


##好书推荐
  * [TCP/IP详解卷1:协议](http://www.amazon.cn/gp/product/B00116OTVS/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00116OTVS&linkCode=as2&tag=droidyue-23)
  * [TCP/IP详解•卷2：实现](http://www.amazon.cn/gp/product/B002FB7KG4/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B002FB7KG4&linkCode=as2&tag=droidyue-23)
  * [TCP.IP详解(卷3):TCP事务协议.HTTP和UNIX域协议](http://www.amazon.cn/gp/product/B002WC7NKO/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B002WC7NKO&linkCode=as2&tag=droidyue-23)
