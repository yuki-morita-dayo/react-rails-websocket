import { WebsocketProvider } from "@y-rb/actioncable";
import { createConsumer } from "@rails/actioncable";
import * as Y from "yjs";
import { useEffect, useState } from "react";
import { BlockNoteEditor } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

export const App = () => {
  const [doc, setDoc] = useState<Y.Doc>();
  const [provider, setProvider] = useState<any>();

  useEffect(() => {
    const consumer = createConsumer("ws://localhost:5000/cable");
    const yDoc = new Y.Doc();
    const yProvider = new WebsocketProvider(yDoc, consumer, "SyncChannel", { id: "1" });
    setDoc(yDoc);
    setProvider(yProvider);

    return () => {
      yDoc?.destroy();
      yProvider?.destroy();
    };
  }, []);

  if (!doc || !provider) {
    return null;
  }

  return <BlockNote doc={doc} provider={provider} />;
};

type EditorProps = {
  doc: Y.Doc;
  provider: any;
};

function BlockNote({ doc, provider }: EditorProps) {
  const editor: BlockNoteEditor = useCreateBlockNote({
    collaboration: {
      provider,
      fragment: doc.getXmlFragment("document-store"),
      user: {
        name: "User",
        color: "#ff0000",
      },
    },
  });

  return <BlockNoteView editor={editor} />;
}
