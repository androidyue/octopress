---
layout: post
title: "Android 抓取 ANR 日志终极办法"
date: 2021-03-07 14:50
comments: true
categories: Android ANR stacktrace bugreport 卡顿 adb 
---

在 Android 开发中，有时会遇到 ANR，一旦出现 ANR 我们就需要拿到对应的trace 文件来分析并解决。本文将介绍两种获取 ANR 的方法。

## 第一种
直接查看`/data/anr/traces.txt`的内容,如下

```bash
adb shell cat  /data/anr/traces.txt
```

或者类似使用拷贝到电脑上查看，比如
```bash
adb shell cp /data/anr/traces.txt /sdcard
adb pull /sdcard/traces.txt ./
```

但是这种方法在某些手机上由于权限原因，无法进行，就需要了使用下面的方法了。

<!--more-->

## 第二种
这种方法就是进行`adb bugreport`，没有权限限制问题。具体步骤是


### 生成 bugreport 文件
```bash
adb bugreport
/data/user_de/0/com.android.shell/files/bugreports/bugreport-sailfish-QP1A.191005.007.A3-2021-01-12-15-30-21.zip: 1 file pulled, 0 skipped. 30.6 MB/s (3897489 bytes in 0.121s)
Bug report copied to /private/tmp/bugreport-sailfish-QP1A.191005.007.A3-2021-01-12-15-30-21.zip
```

### 进行解压文件
```bash
unzip bugreport-sailfish-QP1A.191005.007.A3-2021-01-12-15-32-54.zip
Archive:  bugreport-sailfish-QP1A.191005.007.A3-2021-01-12-15-32-54.zip
  inflating: version.txt
  inflating: proto/SurfaceFlinger_CRITICAL.proto
  inflating: proto/activity_CRITICAL.proto
  inflating: proto/window_CRITICAL.proto
  inflating: FS/data/anr/anr_2021-01-12-14-59-10-559
  inflating: FS/data/misc/recovery/last_log
  inflating: FS/data/misc/recovery/last_kmsg
  inflating: FS/data/misc/recovery/ro.build.fingerprint
  inflating: FS/data/misc/recovery/proc/version
  inflating: FS/data/misc/update_engine_log/update_engine.19700914-172433
  inflating: FS/proc/1/mountinfo
  inflating: FS/proc/642/mountinfo
  inflating: FS/proc/643/mountinfo
  inflating: FS/proc/934/mountinfo
  inflating: FS/proc/2592/mountinfo
  inflating: FS/proc/2619/mountinfo
  inflating: FS/proc/2882/mountinfo
  inflating: FS/proc/3011/mountinfo
  inflating: FS/proc/3031/mountinfo
  inflating: FS/proc/3053/mountinfo
  inflating: FS/proc/3198/mountinfo
  inflating: FS/proc/3255/mountinfo
  inflating: FS/proc/3409/mountinfo
  inflating: FS/proc/3476/mountinfo
  inflating: FS/proc/3584/mountinfo
  inflating: FS/proc/3605/mountinfo
  inflating: FS/proc/3637/mountinfo
  inflating: FS/proc/3664/mountinfo
  inflating: FS/proc/3673/mountinfo
  inflating: FS/proc/3706/mountinfo
  inflating: FS/proc/3732/mountinfo
  inflating: FS/proc/3782/mountinfo
  inflating: FS/proc/3802/mountinfo
  inflating: FS/proc/3832/mountinfo
  inflating: FS/proc/3906/mountinfo
  inflating: FS/proc/3930/mountinfo
  inflating: FS/proc/4582/mountinfo
  inflating: FS/proc/5746/mountinfo
  inflating: FS/proc/6563/mountinfo
  inflating: FS/proc/7454/mountinfo
  inflating: FS/proc/7717/mountinfo
  inflating: FS/proc/8349/mountinfo
  inflating: FS/proc/8367/mountinfo
  inflating: FS/proc/8396/mountinfo
  inflating: FS/proc/8748/mountinfo
  inflating: FS/proc/8838/mountinfo
  inflating: FS/proc/8862/mountinfo
  inflating: FS/proc/8896/mountinfo
  inflating: FS/proc/8941/mountinfo
  inflating: FS/proc/10157/mountinfo
  inflating: FS/proc/10412/mountinfo
  inflating: FS/proc/26397/mountinfo
  inflating: FS/proc/26468/mountinfo
  inflating: FS/proc/27133/mountinfo
  inflating: FS/proc/27518/mountinfo
  inflating: FS/proc/29094/mountinfo
  inflating: FS/proc/29279/mountinfo
  inflating: FS/proc/29701/mountinfo
  inflating: FS/proc/31908/mountinfo
  inflating: lshal-debug/android.frameworks.cameraservice.service@2.0::ICameraService_default.txt
  inflating: lshal-debug/android.frameworks.displayservice@1.0::IDisplayService_default.txt
  inflating: lshal-debug/android.frameworks.schedulerservice@1.0::ISchedulingPolicyService_default.txt
  inflating: lshal-debug/android.frameworks.sensorservice@1.0::ISensorManager_default.txt
  inflating: lshal-debug/android.frameworks.stats@1.0::IStats_default.txt
  inflating: lshal-debug/android.hardware.atrace@1.0::IAtraceDevice_default.txt
  inflating: lshal-debug/android.hardware.audio.effect@5.0::IEffectsFactory_default.txt
  inflating: lshal-debug/android.hardware.audio@5.0::IDevicesFactory_default.txt
  inflating: lshal-debug/android.hardware.biometrics.fingerprint@2.1::IBiometricsFingerprint_default.txt
  inflating: lshal-debug/android.hardware.bluetooth.audio@2.0::IBluetoothAudioProvidersFactory_default.txt
  inflating: lshal-debug/android.hardware.bluetooth@1.0::IBluetoothHci_default.txt
  inflating: lshal-debug/android.hardware.boot@1.0::IBootControl_default.txt
  inflating: lshal-debug/android.hardware.camera.provider@2.4::ICameraProvider_legacy_0.txt
  inflating: lshal-debug/android.hardware.cas@1.0::IMediaCasService_default.txt
  inflating: lshal-debug/android.hardware.cas@1.1::IMediaCasService_default.txt
  inflating: lshal-debug/android.hardware.configstore@1.0::ISurfaceFlingerConfigs_default.txt
  inflating: lshal-debug/android.hardware.configstore@1.1::ISurfaceFlingerConfigs_default.txt
  inflating: lshal-debug/android.hardware.contexthub@1.0::IContexthub_default.txt
  inflating: lshal-debug/android.hardware.drm@1.0::ICryptoFactory_clearkey.txt
  inflating: lshal-debug/android.hardware.drm@1.0::ICryptoFactory_default.txt
  inflating: lshal-debug/android.hardware.drm@1.0::ICryptoFactory_widevine.txt
  inflating: lshal-debug/android.hardware.drm@1.0::IDrmFactory_clearkey.txt
  inflating: lshal-debug/android.hardware.drm@1.0::IDrmFactory_default.txt
  inflating: lshal-debug/android.hardware.drm@1.0::IDrmFactory_widevine.txt
  inflating: lshal-debug/android.hardware.drm@1.1::ICryptoFactory_clearkey.txt
  inflating: lshal-debug/android.hardware.drm@1.1::ICryptoFactory_widevine.txt
  inflating: lshal-debug/android.hardware.drm@1.1::IDrmFactory_clearkey.txt
  inflating: lshal-debug/android.hardware.drm@1.1::IDrmFactory_widevine.txt
  inflating: lshal-debug/android.hardware.drm@1.2::ICryptoFactory_clearkey.txt
  inflating: lshal-debug/android.hardware.drm@1.2::IDrmFactory_clearkey.txt
  inflating: lshal-debug/android.hardware.gatekeeper@1.0::IGatekeeper_default.txt
  inflating: lshal-debug/android.hardware.gnss@1.0::IGnss_default.txt
  inflating: lshal-debug/android.hardware.graphics.composer@2.1::IComposer_default.txt
  inflating: lshal-debug/android.hardware.health@2.0::IHealth_backup.txt
  inflating: lshal-debug/android.hardware.health@2.0::IHealth_default.txt
  inflating: lshal-debug/android.hardware.keymaster@3.0::IKeymasterDevice_default.txt
  inflating: lshal-debug/android.hardware.light@2.0::ILight_default.txt
  inflating: lshal-debug/android.hardware.media.c2@1.0::IComponentStore_software.txt
  inflating: lshal-debug/android.hardware.media.omx@1.0::IOmx_default.txt
  inflating: lshal-debug/android.hardware.media.omx@1.0::IOmxStore_default.txt
  inflating: lshal-debug/android.hardware.memtrack@1.0::IMemtrack_default.txt
  inflating: lshal-debug/android.hardware.nfc@1.0::INfc_default.txt
  inflating: lshal-debug/android.hardware.nfc@1.1::INfc_default.txt
  inflating: lshal-debug/android.hardware.power@1.0::IPower_default.txt
  inflating: lshal-debug/android.hardware.power@1.1::IPower_default.txt
  inflating: lshal-debug/android.hardware.radio.deprecated@1.0::IOemHook_slot1.txt
  inflating: lshal-debug/android.hardware.radio@1.0::IRadio_slot1.txt
  inflating: lshal-debug/android.hardware.radio@1.0::ISap_slot1.txt
  inflating: lshal-debug/android.hardware.radio@1.1::IRadio_slot1.txt
  inflating: lshal-debug/android.hardware.radio@1.1::ISap_slot1.txt
  inflating: lshal-debug/android.hardware.sensors@1.0::ISensors_default.txt
  inflating: lshal-debug/android.hardware.soundtrigger@2.0::ISoundTriggerHw_default.txt
  inflating: lshal-debug/android.hardware.soundtrigger@2.1::ISoundTriggerHw_default.txt
  inflating: lshal-debug/android.hardware.soundtrigger@2.2::ISoundTriggerHw_default.txt
  inflating: lshal-debug/android.hardware.thermal@1.0::IThermal_default.txt
  inflating: lshal-debug/android.hardware.thermal@2.0::IThermal_default.txt
  inflating: lshal-debug/android.hardware.usb@1.0::IUsb_default.txt
  inflating: lshal-debug/android.hardware.usb@1.1::IUsb_default.txt
  inflating: lshal-debug/android.hardware.vr@1.0::IVr_default.txt
  inflating: lshal-debug/android.hardware.wifi.supplicant@1.0::ISupplicant_default.txt
  inflating: lshal-debug/android.hardware.wifi.supplicant@1.1::ISupplicant_default.txt
  inflating: lshal-debug/android.hardware.wifi.supplicant@1.2::ISupplicant_default.txt
  inflating: lshal-debug/android.hardware.wifi@1.3::IWifi_default.txt
  inflating: lshal-debug/android.hidl.allocator@1.0::IAllocator_ashmem.txt
  inflating: lshal-debug/android.hidl.base@1.0::IBase_AtCmdFwdService.txt
  inflating: lshal-debug/android.hidl.base@1.0::IBase_ashmem.txt
  inflating: lshal-debug/android.hidl.base@1.0::IBase_backup.txt
  inflating: lshal-debug/android.hidl.base@1.0::IBase_clearkey.txt
  inflating: lshal-debug/android.hidl.base@1.0::IBase_legacy_0.txt
  inflating: lshal-debug/android.hidl.base@1.0::IBase_slot1.txt
  inflating: lshal-debug/android.hidl.base@1.0::IBase_software.txt
  inflating: lshal-debug/android.hidl.base@1.0::IBase_widevine.txt
  inflating: lshal-debug/android.hidl.token@1.0::ITokenManager_default.txt
  inflating: lshal-debug/android.system.net.netd@1.0::INetd_default.txt
  inflating: lshal-debug/android.system.net.netd@1.1::INetd_default.txt
  inflating: lshal-debug/android.system.wifi.keystore@1.0::IKeystore_default.txt
  inflating: lshal-debug/vendor.qti.atcmdfwd@1.0::IAtCmdFwd_AtCmdFwdService.txt
  inflating: lshal-debug/vendor.qti.qcril.am@1.0::IQcRilAudio_default.txt
  inflating: dumpstate_board.txt
  inflating: proto/activity.proto
  inflating: proto/incident.proto
  inflating: proto/stats.proto
  inflating: bugreport-sailfish-QP1A.191005.007.A3-2021-01-12-15-32-54.txt
  inflating: main_entry.txt
  inflating: dumpstate_log.txt
```

### 查看 ANR stacktrace 文件

文件路径通常为`FS/data/anr`，具体可以根据日期来确定哪一个文件。

```bash
cat FS/data/anr/anr_2021-01-12-14-59-10-559
```
