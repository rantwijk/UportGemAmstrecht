import 'babel-polyfill'
import * as constants from './constants'
import Vue from 'vue/dist/vue.esm.js'

const uportConnect = require('uport-connect');
const qrcode = require('qrcode-terminal');

const uport = new uportConnect.Connect(constants.appName, {
    //uriHandler,
    clientId: constants.mnidAddress,
    network: constants.network,
    signer: uportConnect.SimpleSigner(constants.signingKey)
});

let creds = null;
let receiver = '';
let dob = null;

new Vue({
    el: '#app',
    data: {
      user: null,
    },
    methods: {
      login: function() {
        let app = this
        // Request credentials
        uport.requestCredentials({
            requested: ['name', 'avatar', 'address', 'publicKey', 'publicEncKey'],
            notifications: true
        }).then((credentials) => {
            app.user = credentials;
            creds = app.user;
            receiver = creds.did;
        }).then(() => {
          if(creds.avatar.uri!=null){
            document.getElementById("avatarImg").src=creds.avatar.uri;
          }
        })
      },
      logout: function() {
        this.user = null;
      },
      setDoB: function() {
        let dobValue = document.getElementById("dob").value;
        dob = dobValue;
        document.getElementById("dobText").innerHTML="Date of Birth saved: " + dob;
      },
      issueDoB: function() {
        if(dob!=null){
          uport.attestCredentials({
            sub: receiver,
            claim: { 'DoB': dob },
          })
        }
      }
    },
  })
  
