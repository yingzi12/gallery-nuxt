<template>
  <div class="yw-page yw-page-app container">
    <div class="yw-header jsHeader">
      <div class="yw-constr app-constr">
        <div class="yw-hd-slide-x">
          <div class="yw-hd-slide-con app-yhsc">
            <h2 class="yw-hd-slide-h app-yhsh yw-font">海量图片</h2>
            <p class="yw-hd-slide-p app-yhsp">美女写真汇集，各种类型的美女写真图片</p>
            <p class="yw-hd-slide-p app-yhsp">用户自建图集，用户自行定价，用户自定会员</p>
            <p class="yw-hd-slide-p app-yhsp">电脑站、手机站、app，多种终端无广告</p>
            <div class="yw-hd-app-dld">
              <a class="yw-hd-app-btn" href="https://www.aiavr.uk/Album-Gallery-1.0.1.apk" target="_blank"><i
                  class="icon-android"></i>安卓版下载</a>
              <div class="qr-box" onmouseout="this.className='qr-box'" onmouseover="this.className='qr-box cur'">
                <a class="qq-qr-icon jsLoadQr"><i class="icon-qr"></i></a>
              </div>
            </div>
            <div class="yw-app-mb-pic"><img class="yw-app-mb" src="/frame.png" style="width: 400px"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

</script>

<style>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.left, .right {
  margin: 10px;
}

.left img, .right img {
  max-width: 100%;
  height: auto;
}
</style>
