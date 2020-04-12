---
layout: post
title: "Centos(Linux)系统下实现挂载硬盘"
date: 2020-04-12 20:50
comments: true
categories: centos linux ubuntu fedora debian mount bash fdisk mount lsblk 
---
## 背景

  * 团队的CI机器有两块硬盘，一块是256G SSD,另一块是1T 机械硬盘。
  * 系统安装到了SSD上，1T的机械硬盘处于闲置状态，需要挂载，用来存放一些文件。

<!--more-->

## 注意事项
  * 文章提到的`/dev/sda`和`/mnthhd_my`仅为示例说明
  * 需要根据自己的真实情况进行替换，尤其是格式化硬盘是要格外注意。

## 确定新硬盘

### 使用fdisk -l

使用fdisk并且配合目标硬盘的容量1T,我们可以轻松的找到未挂载的硬盘是`/dev/sda`

```bash
sudo fdisk -l

Disk /dev/nvme0n1: 238.5 GiB, 256060514304 bytes, 500118192 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: gpt
Disk identifier: XXXXXX-C9A1-4D0D-8CF5-XXXXX

Device           Start       End   Sectors   Size Type
/dev/nvme0n1p1    2048   1230847   1228800   600M EFI System
/dev/nvme0n1p2 1230848   3327999   2097152     1G Linux filesystem
/dev/nvme0n1p3 3328000 500117503 496789504 236.9G Linux LVM


Disk /dev/sda: 931.5 GiB, 1000204886016 bytes, 1953525168 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 4096 bytes
I/O size (minimum/optimal): 4096 bytes / 4096 bytes


Disk /dev/mapper/cl-root: 50 GiB, 53687091200 bytes, 104857600 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes


Disk /dev/mapper/cl-swap: 15.7 GiB, 16869490688 bytes, 32948224 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes


Disk /dev/mapper/cl-home: 171.2 GiB, 183798595584 bytes, 358981632 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
```

### (可选)使用lsblk

如果有下面的情况，可以使用lsblk

  * 新的硬盘和已有硬盘容量相同，无法确定
  * 再次确定新的硬盘是否是没有挂载

```bash
➜  ~ lsblk
NAME        MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT
sda           8:0    0 931.5G  0 disk
nvme0n1     259:0    0 238.5G  0 disk
├─nvme0n1p1 259:1    0   600M  0 part /boot/efi
├─nvme0n1p2 259:2    0     1G  0 part /boot
└─nvme0n1p3 259:3    0 236.9G  0 part
  ├─cl-root 253:0    0    50G  0 lvm  /
  ├─cl-swap 253:1    0  15.7G  0 lvm  [SWAP]
  └─cl-home 253:2    0 171.2G  0 lvm  /home
```

如上

  * sda 的 MOUNTPOINT对应的为空，表明并没有挂载

## (可选)创建文件系统

其实就是格式化新的硬盘，这一步是比较危险的，一定要确保`/dev/sda`是你那里正确的硬盘。

```bash
mkfs -t ext4 /dev/sda
```

这一步并非必须的，但是如果需要这样的问题`wrong fs type, bad option, bad superblock on /dev/sda, missing codepage or helper program, or other error`。则需要执行这一个步骤。

## 创建挂载点

```bash
sudo mkdir /mnthhd_my
```

其中`/mnthhd_my`并没有限定，可以为其他路径。

## 进行挂载
```bash
sudo mount /dev/sda mnthhd_my
```

## 验证挂载
```bash
➜  ~ lsblk
NAME        MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT
sda           8:0    0 931.5G  0 disk /mnthhd_my
nvme0n1     259:0    0 238.5G  0 disk
├─nvme0n1p1 259:1    0   600M  0 part /boot/efi
├─nvme0n1p2 259:2    0     1G  0 part /boot
└─nvme0n1p3 259:3    0 236.9G  0 part
  ├─cl-root 253:0    0    50G  0 lvm  /
  ├─cl-swap 253:1    0  15.7G  0 lvm  [SWAP]
  └─cl-home 253:2    0 171.2G  0 lvm  /home
```
sda对应的MOUNTPOINT的值变成了`/mnthhd_my`


## 开机自动挂载硬盘
  * 上面的挂载只在当前系统运行期间生效。
  * 想要开机自动挂载需要额外的修改。

### 实施步骤
  1. 备份现有配置文件，执行`cp /etc/fstab /etc/fstab.backup`
  2. 打开配置文件  `sudo vim /etc/fstab`
  3. 文件最后添加挂载配置 `/dev/sda  /mnthhd_my   ext4    defaults    0 2`
  4. 保存文件
  5. 使用`mount -a`验证fstab配置是否正确。
  6. 重启服务器进行验证。



