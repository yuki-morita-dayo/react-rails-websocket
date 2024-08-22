class ChatChannel < ApplicationCable::Channel
  def subscribed
    stream_from("chat:#{params[:room]}")
  end

  def speak(data)
    content = {
      type: 'speak',
      body: {
        name: data['name'],
        message: data['message'],
        spoke_at: Time.zone.now,
      },
    }
    ActionCable.server.broadcast("chat:#{params[:room]}", content)
  end

  def test
    ActionCable.server.broadcast("chat:#{params[:room]}", { body: "「#{params[:room]}」を購読中です" })
  end
end