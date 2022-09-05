"use strict";

class Overworld {
  constructor(config) {
    // passing in an element
    this.element = config.element;
    // in this element, reference the canvas
    this.canvas = this.element.querySelector(".game-canvas");
    // in this canvas, reference drawing methods?? stuff? idk
    this.ctx = this.canvas.getContext("2d");

    this.maxEmotes = 25;

    this.userAvatars = {};
    this.renderedEmotes = [];

    this.isCutscenePlaying = false;
  }

  createNewUserAvatar(user) {
    let avatar = new Avatar({
      name: user.name,
      color: user.color,
      x: Math.random() * this.canvas.width,
      y: 850,
      src: "images/chars/bunny.png",
      mask: "images/chars/bunny-mask.png",
    });
    this.userAvatars[user.name] = avatar;
  }

  update(users, emoteArray, messagesObject) {
    // difference between value and keys:
    // value = {name: 'kirinokirino', messageCount: 2}
    // key = kirinokirino
    // key is like 1 in array[1]
    for (const user of Object.keys(users)) {
      if (!this.userAvatars[user]) {
        this.createNewUserAvatar(users[user]);
      }

      // check if user wrote a message
      if (messagesObject[user]) {
        this.userAvatars[user].changeBehaviour("talk");
      }
    }
    for (let i = 0; i < emoteArray.length; i++) {
      this.createNewEmote(
        emoteArray[i].id,
        this.userAvatars[emoteArray[i].name].x,
        this.userAvatars[emoteArray[i].name].y
      );
    }
  }
  createNewEmote(emoteId, userAvatarx, userAvatary) {
    let emote = new Emote({
      x: userAvatarx + 75 / 2,
      y: userAvatary - 25,
      src: this.getEmoteImg(emoteId),
      speedPhysicsX: Math.random() * 6 - 3,
      speedPhysicsY: -(Math.random() * 5),
      dragPhysicsY: -0.02,
    });
    this.renderedEmotes.push(emote);

    console.log(this.userAvatars);
  }

  // get (normal twitchtv) emotes
  getEmoteImg(emoteId) {
    return (
      "https://static-cdn.jtvnw.net/emoticons/v2/" +
      emoteId +
      "/default/dark/2.0"
    );
  }

  // game loop
  // - updating frames, moving pos of the chars
  startGameLoop() {
    const step = () => {
      // clear canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // aligns all
      this.ctx.textAlign = "center";

      for (const userAvatar of Object.values(this.userAvatars)) {
        userAvatar.update();
        userAvatar.sprite.draw(this.ctx);
        this.ctx.fillStyle = userAvatar.color;
        this.ctx.font = "bold 16px VictorMono-Medium";
        this.ctx.fillText(
          userAvatar.name,
          userAvatar.x + userAvatar.sprite.displaySize / 2,
          userAvatar.y + userAvatar.sprite.displaySize + 3
        );
      }
      // for(const emote of Object.values(this.renderedEmotes)){
      //     emote.update();
      //     emote.sprite.draw(this.ctx);
      // }
      for (
        let i =
          this.renderedEmotes.length > this.maxEmotes
            ? this.renderedEmotes.length - this.maxEmotes
            : 0;
        i < this.renderedEmotes.length;
        i++
      ) {
        this.renderedEmotes[i].update();
        this.renderedEmotes[i].sprite.draw(this.ctx);
      }
      requestAnimationFrame(() => {
        step();
      });
    };
    step();
  }

  init() {
    this.startGameLoop();
    console.log("init");
  }
}
