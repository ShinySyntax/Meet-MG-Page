<template>
    <div class="content">
        <img src="~@_/assets/img/common/err.png" class="errorimg"/>
        <div class="body">
            <p>error</p>
            <p>页面访问异常，请检查后重试！</p>
        </div>
    </div>
</template>
<style lang="less" scoped>
.content{
    width:100%;
    height:100%;
    background: @mainBg;
    justify-content: center;
    .flexbox;
    .errorimg{
        width:456px;
    }
    .body{
        color:#8398AA;
        margin-left:65px;
        p:nth-child(1){
            font-size:72px;
            margin-bottom:22px;
            line-height: 1;
        }
        p:nth-child(2){
            font-size:20px;
            line-height: 1;
        }
    }
}
</style>
