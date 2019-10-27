---
layout: post
title: "在终端使用脚本查看网站 SSL 证书信息"
date: 2019-10-27 18:23
comments: true
categories: SSL 证书 certificate 终端 Shell Bash 脚本
---

之前遇到过一次赛门铁克很久的证书被Chrome弃用的问题，涉及到了查看证书。当然第一个大家会想到的是在浏览器中查看，但是总是感觉不够极客。后来摸索找到了终端查看网站证书的方法

<!--more-->
## 脚本内容
```bash
#!/bin/bash
echo | openssl s_client -showcerts -servername $1 -connect $2:443 2>/dev/null | openssl x509 -inform pem -noout -text
```

将上面的文件保存成`checkSSLCertificate.sh`并增加执行权限`chmod a+x checkSSLCertificate.sh`

## 使用方法
```bash
checkSSLCertificate.sh domain server_ip
```

  * domain 域名 比如droidyue.com 
  * server_ip 服务器端ip，一个域名可以对应多个ip,可以使用ping命令获取域名对应的服务器ip

## 示例
```bash
MacBook-Pro-7:~/Documents/OneDrive/scripts(:|✔) %checkSSLCertificate.sh droidyue.com 104.27.129.205
Certificate:
    Data:
        Version: 3 (0x2)
        Serial Number:
            05:f6:c5:0d:86:17:c1:6c:cb:a3:6c:01:85:b7:ff:a0
    Signature Algorithm: ecdsa-with-SHA256
        Issuer: C=US, ST=CA, L=San Francisco, O=CloudFlare, Inc., CN=CloudFlare Inc ECC CA-2
        Validity
            Not Before: Oct  2 00:00:00 2018 GMT
            Not After : Oct  2 12:00:00 2019 GMT
        Subject: C=US, ST=CA, L=San Francisco, O=CloudFlare, Inc., CN=sni.cloudflaressl.com
        Subject Public Key Info:
            Public Key Algorithm: id-ecPublicKey
                Public-Key: (256 bit)
                pub:
                    04:75:31:b0:0f:40:66:72:4f:b2:d3:d3:ab:9a:eb:
                    b8:70:f3:6e:73:ed:56:51:39:7f:49:d8:ad:c8:4c:
                    cb:12:16:67:7d:09:c5:51:68:f5:12:ac:89:cc:ec:
                    f4:b0:1c:4e:09:1c:01:2e:6b:7d:01:0c:f5:0c:d5:
                    0c:7e:7d:09:53
                ASN1 OID: prime256v1
                NIST CURVE: P-256
        X509v3 extensions:
            X509v3 Authority Key Identifier:
                keyid:3E:74:2D:1F:CF:45:75:04:7E:3F:C0:A2:87:3E:4C:43:83:51:13:C6

            X509v3 Subject Key Identifier:
                FE:75:3B:AF:CD:5F:46:26:4F:B1:A1:F0:3A:4C:C3:82:D1:FF:AF:F7
            X509v3 Subject Alternative Name:
                DNS:sni.cloudflaressl.com, DNS:droidyue.com, DNS:*.droidyue.com
            X509v3 Key Usage: critical
                Digital Signature
            X509v3 Extended Key Usage:
                TLS Web Server Authentication, TLS Web Client Authentication
            X509v3 CRL Distribution Points:

                Full Name:
                  URI:http://crl3.digicert.com/CloudFlareIncECCCA2.crl

                Full Name:
                  URI:http://crl4.digicert.com/CloudFlareIncECCCA2.crl

            X509v3 Certificate Policies:
                Policy: 2.16.840.1.114412.1.1
                  CPS: https://www.digicert.com/CPS
                Policy: 2.23.140.1.2.2

            Authority Information Access:
                OCSP - URI:http://ocsp.digicert.com
                CA Issuers - URI:http://cacerts.digicert.com/CloudFlareIncECCCA-2.crt

            X509v3 Basic Constraints: critical
                CA:FALSE
            1.3.6.1.4.1.11129.2.4.2:
                ......w.......X......gp
.....f4".......H0F.!..B.#....3.A.s%1...;...n..-.U~T?m.!.....\V....^.N..M..bt..S......__..w.t~..1.3..!..%OBp...^B ..75y..{.V...f4".......H0F.!........-'@.$.o......x.F.I.0F.....!....J..m<.|...q.t2c..L...^.T.?.L.
    Signature Algorithm: ecdsa-with-SHA256
         30:46:02:21:00:cf:d8:25:3e:a5:2f:cd:dc:1a:07:11:eb:f0:
         53:e1:fb:42:53:5b:1f:2f:4b:e5:02:5a:c3:76:bd:23:78:68:
         cb:02:21:00:8c:9d:36:2e:c0:3b:af:93:ea:8b:e3:29:54:25:
         4f:30:04:af:a0:be:bd:71:ab:64:5c:f4:93:5d:bd:84:2c:5a
```

使用终端一时爽，一直使用一直爽。

以上。

点击[更多脚本](https://droidyue.com/blog/categories/jiao-ben/) 了解更多脚本