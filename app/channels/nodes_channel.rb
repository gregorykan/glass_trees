class NodesChannel < ApplicationCable::Channel
  def subscribed
    stream_from "nodes_channel"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
