const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// /A/ https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// firebase認証
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// API通信
const express = require('express');
const app = express();

// クロスドメイン通信
const cors = require('cors')({origin: true});
app.use(cors);


const anonymousUser = {
    id: "anon",
    name: "Anonymous",
    avatar: ""
};

// 実行するユーザーの設定
const checkUser = (req, res, next) => {
    req.user = anonymousUser;
    if (req.query.auth_token !== undefined) {
        let idToken = req.query.auth_token;
         // 通信を行い、レスポンスから認証ユーザーを取得。
        admin.auth().verifyIdToken(idToken).then(decodedIdToken => {
            let authUser = {
                id: decodedIdToken.user_id,
                name: decodedIdToken.name,
                avatar: decodedIdToken.picture
            };
            // 取得したユーザーを設定
            req.user = authUser;
            next();
        }).catch(error => {
            next();
        });
    } else {
        next();
    };
};

// 設定をロードする
app.use(checkUser);

// チャンネル作成
// cnameは作るチャンネル名
function createChannel(cname){
    let channelsRef = admin.database().ref('channels');
    let date1 = new Date();
    let date2 = new Date();
    date2.setSeconds(date2.getSeconds() + 1);
     // 最初に表示するためのデータ
    const defaultData = `{
        "messages" : {
            "1" : {
                "body" : "Welcome to #${cname} channel!",
                "date" : "${date1.toJSON()}",
                "user" : {
                    "avatar" : "",
                    "id" : "robot",
                    "name" : "Robot"
                }
            },
            "2" : {
                "body" : "はじめてのメッセージを投稿してみましょう。",
                "date" : "${date2.toJSON()}",
                "user" : {
                    "avatar" : "",
                    "id" : "robot",
                    "name" : "Robot"
                }
            }
        }
    }`;
      // チャンネル名を設定し、デフォルトデータを設定
    channelsRef.child(cname).set(JSON.parse(defaultData));
}

// チャンネル作成を実行する
app.post('/channels', (req, res) => {
    // 名前を決定
    let cname = req.body.cname;
    // チャンネル作成
    createChannel(cname);
    res.header('Content-Type', 'application/json; charset=utf-8');
    res.status(201).json({result: 'ok'});

});

// チャンネル一覧の取得
app.get('/channels', (req, res) => {
    let channelsRef = admin.database().ref('channels');
     // valueはデータの読み込み時に使用
    // onceでコールバック処理を実行
    channelsRef.once('value', function(snapshot) {
        let items = new Array();
        snapshot.forEach(function(childSnapshot) {
            let cname = childSnapshot.key;
            items.push(cname);
        });
        res.header('Content-Type', 'application/json; charset=utf-8');
        res.send({channels: items});
    });
});

// メッセージの追加
app.post('/channels/:cname/messages', (req, res) => {
     // 部屋名
    let cname = req.params.cname;
      // メッセージ
    let message = {
        date: new Date().toJSON(),
        body: req.body.body,
        user: req.user
    };
    // DB接続
    let messagesRef = admin.database().ref(`channels/${cname}/messages`);
    // メッセージ追加
    messagesRef.push(message);
    res.header('Content-Type', 'application/json; charset=utf-8');
    res.status(201).send({result: "ok"});
});

// メッセージ一覧の取得
app.get('/channels/:cname/messages', (req, res) => {
    let cname = req.params.cname;
    // 最新２０件取得?
    let messagesRef = admin.database().ref(`channels/${cname}/messages`).orderByChild('date').limitToLast(20);

    // 読み込みなのでvalue
    messagesRef.once('value', function(snapshot) {
        let items = new Array();
        // １件１件取得
        snapshot.forEach(function(childSnapshot) {
            let message = childSnapshot.val();
            message.id = childSnapshot.key;
            // 管理しているitemsに入れる
            items.push(message);
        });
        items.reverse();
        res.header('Content-Type', 'application/json; charset=utf-8');
        res.send({messages: items});
    });
});

app.post('/reset', (req, res) => {
    createChannel('general');
    createChannel('random');
    res.header('Content-Type', 'application/json; charset=utf-8');
    res.status(201).send({result: "ok"});
});

// 外部からappを呼ぶために必要
exports.v1 = functions.https.onRequest(app);