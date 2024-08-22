import ActionCable from "actioncable";
import { useEffect, useState } from "react";

export const App = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [chatChannel, setChatChannel] = useState<any>(null);

  useEffect(() => {
    // 接続を生成（引数は、'ws://[Railsの接続URL]/cable'）
    const cable = ActionCable.createConsumer("ws://localhost:5000/cable");

    // chatチャンネルのサブスクリプションを作成
    const subscription = cable.subscriptions.create(
      { channel: "ChatChannel", room: "チャットルーム" },
      {
        received({ type, body }) {
          switch (type) {
            case "speak":
              setMessages((prev) => [...prev, body]);
              break;
          }
        },
      }
    );

    // チャンネルを状態として保存
    setChatChannel(subscription);

    return () => {
      // コンポーネントがアンマウントされるときにサブスクリプションを解除
      subscription.unsubscribe();
    };
  }, []); // 空の依存配列を使うことで、一度だけ実行

  const speak = () => {
    if (chatChannel) {
      // performの第二引数でサーバー側の関数の引数を設定できる
      chatChannel.perform("speak", {
        message: message,
        name: name,
      });
      setMessage("");
    }
  };

  const test = () => {
    if (chatChannel) {
      chatChannel.perform("test", {});
    }
  };

  return (
    <div>
      <button onClick={test}>hoge</button>
      <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="message" />
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="name" />
      <button onClick={speak}>post</button>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>
            message: {message.message}, name: {message.name}
          </li>
        ))}
      </ul>
    </div>
  );
};
