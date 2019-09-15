
MyBookFarm
==========

自分が読んだ書籍のページ数進捗管理を目的としたWEBアプリです。   
githubの草を生やす機能のように、日々の本の進捗に応じてカレンダーが色づいていくことで、  
技術書等の本を読むモチベーション維持につながるのではないかと思い、アプリを作ってみました。  

AWSホスティングページは[こちら](http://mybookfarm.com)  
※AWS料金の関係で、基本的にサーバを落としています。

サーバ側のソースはこちら  
https://github.com/knry0329/bitter

サイトイメージ  
1.　マイページ（アカウント情報）
<img width="1440" alt="スクリーンショット 2019-09-15 14 15 11" src="https://user-images.githubusercontent.com/24874752/64916951-1ad1d880-d7c5-11e9-9c73-39dac1cec92e.png">  
  
2.　マイページ（My本棚）
<img width="1440" alt="スクリーンショット 2019-09-15 14 15 21" src="https://user-images.githubusercontent.com/24874752/64916954-2b824e80-d7c5-11e9-9c23-914e5dafbb3e.png">  
  
3.　マイ書籍詳細
<img width="1440" alt="スクリーンショット 2019-09-15 14 15 40" src="https://user-images.githubusercontent.com/24874752/64916967-3b9a2e00-d7c5-11e9-9853-0b7c38c7448d.png">  
  
4.　書籍検索
<img width="1440" alt="スクリーンショット 2019-09-15 14 16 05" src="https://user-images.githubusercontent.com/24874752/64916975-48b71d00-d7c5-11e9-87ba-451b476a9e74.png">  
  

目次
-----------------

  * [機能一覧](#機能一覧)
  * [環境](#環境)
  * [自動化](#自動化)
  * [使用している技術](#使用している技術)


機能一覧
------------

  * サインアップ、ログイン、ログアウト（Firebase Authentication APIを使用）
  * マイページ（アカウント画像の入取得にFirebase Storage APIを使用）
  * 書籍検索（Google Books APIを使用）
  * My書籍の登録
  * My書籍のページ数進捗管理、コメント付与
  * My書籍一覧確認
  * カレンダーによる日毎の進み具合を可視化
  * 同じ本を読んでいるアカウントページの閲覧

環境
------------

  * 本番環境  
  AWSにデプロイ

  * 開発環境  
  Dockerでの環境構築中

自動化
------------

  * CircleCIによるテスト自動化作成中  

使用している技術
-----
* サーバサイド
    * Java(JDK 1.8)  
    * Spring Boot
    * Mybatis
    * MySQL
    * Flyway

* フロントサイド
    * Vue.js
    * npm
    * axios
    * eslint
    * element-ui
    * v-calendar

* 外部API
    * Firebase Authentication
    * Firebase Storage
    * Google Books API

* インフラ
    * AWS EC2
    * AWS Route53

License
-------

Copyright &copy; 2019, knry0329
