require "y/actioncable"

# app/channels/sync_channel.rb
class SyncChannel < ApplicationCable::Channel
  
    def subscribed
      stream_from("document-1")
    end
  
    def receive(message)
      ActionCable.server.broadcast("document-1", message)
    end
  end