import React, { Component } from "react";
import io from "socket.io-client";
import api from "../../services/api";

import more from "../../assets/more.svg";
import like from "../../assets/like.svg";
import comment from "../../assets/comment.svg";
import send from "../../assets/send.svg";

import "./styles.css";

export default class Feed extends Component {
  state = {
    feeds: []
  };

  async componentDidMount() {
    this.registerToSocket();
    const { data } = await api.get("posts");
    this.setState({ feeds: data });
  }

  registerToSocket = () => {
    const socket = io("http://localhost:3330");

    socket.on("post", newPost => {
      this.setState({ feeds: [newPost, ...this.state.feeds] });
    });

    socket.on("like", likePost => {
      this.setState({
        feeds: this.state.feeds.map(feed =>
          feed._id === likePost._id ? likePost : feed
        )
      });
    });
  };

  handleLike = id => {
    api.post(`/posts/${id}/like`);
  };

  render() {
    const { feeds } = this.state;
    return (
      <section id="post-list">
        {feeds.map(feed => (
          <article key={feed._id}>
            <header>
              <div className="user-info">
                <span>{feed.author}</span>
                <span className="place">{feed.place}</span>
              </div>

              <img src={more} alt="Mais" />
            </header>
            <img
              src={`http://localhost:3330/files/${feed.image}`}
              alt={`Foto em ${feed.place}`}
            />
            <footer>
              <div className="actions">
                <button type="button" onClick={() => this.handleLike(feed._id)}>
                  <img src={like} alt="Curti" />
                </button>

                <img src={comment} alt="Comentar" />
                <img src={send} alt="Enviar" />
              </div>
              <strong>{feed.likes} curtidas</strong>
              <p>
                {feed.discription} <span>{feed.hashtags}</span>
              </p>
            </footer>
          </article>
        ))}
      </section>
    );
  }
}
