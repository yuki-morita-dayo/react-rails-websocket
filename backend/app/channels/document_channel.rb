class DocumentChannel < ApplicationCable::Channel
  def subscribed
    stream_from "document_channel"
  end

  def receive(data)
    ActionCable.server.broadcast("document_channel", data.to_json)
  end
end