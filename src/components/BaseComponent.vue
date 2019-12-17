<template>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import JsEncrypt from 'jsencrypt/bin/jsencrypt'

@Component
export default class BaseComponent extends Vue {
    patientId = 0
    patientDlgVisible = false

    showPatientDlg(patientId) {
        this.patientId = patientId;
        this.patientDlgVisible = true;
    }

    isNullOrEmpty(val) {
        if(val === undefined || val === null || val === "") {
            return true
        }
        return false;
    }

    isNotNullOrEmpty(val) {
        if(this.isNullOrEmpty(val)) {
            return false
        }
        return true
    }

    rsaEncrypt(data) {
        if(this.isNullOrEmpty(data)) {
            return data;
        }
        let rsaKey = this.store.getApiRsaPublicKey();
        if(this.isNullOrEmpty(rsaKey)) {
            return data;
        }

        let jsEncrypt = new JsEncrypt();
        jsEncrypt.setPublicKey(rsaKey);
        return jsEncrypt.encrypt(data);
    }

    alert(msgVal, msgType = "info") {
        this.$message({
                showClose: true,
                message: msgVal,
                type: msgType
            });
    }
    info(msg) {
        this.alert(msg, "info");
    }
    success(msg) {
        this.alert(msg, "success");
    }
    warning(msg) {
        this.alert(msg, "warning");
    }
    error(msg) {
        this.alert(msg, "error");
    }
    errorEx(err) {
        if(err) {
            let msg = "<strong>" + err.summary + "</strong>" + "<p>&nbsp;</p><p>" + err.detail +"</p>";
            this.$message({
                dangerouslyUseHTMLString: true,
                showClose: true,
                message: msg,
                type: "error"
            });
        }
    }

    redirectTo(path) {
        if(this.isNullOrEmpty(path)) {
            return;
        }
        this.$router.push({ path: path });
    }

    redirectToAndParmas(name, params) {
        if(this.isNullOrEmpty(name)) {
            return;
        }
        this.$router.push({ name: name, params: params });
    }

    openTabPage(name, params) {
        if(this.isNullOrEmpty(name)) {
            return;
        }
        let routeData = this.$router.resolve({
            name: name,
            params: params,
        });
        window.open(routeData.href, '_blank');
    }

    getDaysText(day) {
        if(day === 0) {
            return " (今天)";
        }
        else if(day === -1) {
            return " (昨天)";
        }
        else if(day === -2) {
            return " (前天)";
        }
        else if(day < -2) {
            return " (" + Math.abs(day) + "天前)";
        }
        else if(day === 1) {
            return " (明天)";
        }
        else if(day === 2) {
            return " (后天)";
        }
        else if(day > 2) {
            return " (" + day + "天后)";
        }

        return "";
    }

    toDateText(dateTime) {
        try {
            let dt = new Date(dateTime);
            let month = dt.getMonth()+1;
            return dt.getFullYear()+'-'+month+'-'+dt.getDate();
        }
        catch (e) {
            console.log(e);
        }

        return "";
    }

    toDays(dateStart, dateEnd) {
        try {
            let start = new Date(dateStart);
            let end = new Date(dateEnd);
            let oneDay = 1000*60*60*24;

            return Math.round((end.getTime() - start.getTime()) / oneDay) + 1;
        }
        catch (e) {
            console.log(e);
        }

        return 0;
    }

    onInterceptor(response) {
        if(response.data) {
            // 无效凭证，需要登录
            if(response.data.code === 20001) {
                this.store.setApiLogined(false);
                let path = "/";
                let fromPath = this.$router.history.current.path;
                if(fromPath) {
                    path = fromPath;
                }
                this.$router.push({ name: "Login", params: {backPath: path} });
            }
        }

        return response;
    }

    // example
    // uri: "/user/info"
    // argument: {id: "111212323"}
    // handler: function(code, error, data){ }
    post(uri, argument, handler) {
        this.network.post(uri, argument, handler, this.onInterceptor);
    }

    // example
    // uri: "/user/info"
    // argument: {id: "111212323"}
    // handler: function(code, error, data){ }
    // uploadProgress: function(progressEvent) {
    //   let percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
    // }
    upload(uri, argument, handler, uploadProgress) {
        this.network.upload(uri, argument, handler, this.onInterceptor, uploadProgress);
    }
}
</script>
