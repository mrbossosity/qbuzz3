const socket = io();
var canBuzz = true;

socket.on('connect', () => {
  socket.on('player-join', player => {
    alert(`${player} joined the room!`)
  })

  socket.on('player-leave', player => {
    alert(`${player} left the room!`)
  })

  socket.on('buzzer-lockout', player => {
    canBuzz = false;
    document.querySelector('#team-2-buzzer').play();
    document.querySelector('.mod-buzz-player').innerText = `${player}`;
    document.querySelector('.mod-buzz-light').style.backgroundColor = "limegreen"
  })
  
  socket.on('buzzer-clear', () => {
    canBuzz = true;
    document.querySelector('.buzz-inner-light').style.backgroundColor = "gray"
  })
})

function codeGen(length) {
  var digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  var id = '', x = 0;
  while (x < length) { 
      let digit = digits[Math.floor(Math.random() * digits.length)];
      id += digit;
      x ++
  }
  return id
}

const app = new Vue({
  el: "#app",
  data() {
    return {
      homeWindow: true,
      guestWindow: false,
      hostWindow: false,
      homeModal: true,
      joinModal: false,
      hostModal: false,
      playerName: "Anon",
      roomCode: null,
      inGame: false
    }
  },

  methods: {
    showJoinModal() {
      this.homeModal = false;
      this.joinModal = true
    },

    showHostModal() {
      this.homeModal = false;
      this.hostModal = true;
      if (this.roomCode == null) {
        this.roomCode = codeGen(6)
      }
    },

    joinRoom() {
      this.homeWindow = false;
      this.guestWindow = true;
      this.inGame = true;
      socket.emit("join-room", this.playerName, this.roomCode)
    },

    hostRoom() {
      this.homeWindow = false;
      this.hostWindow = true;
      this.inGame = true;
      socket.emit("join-room", this.playerName, this.roomCode)
    },

    backHome() {
      this.joinModal = false;
      this.hostModal = false;
      this.guestWindow = false;
      this.hostWindow = false;
      this.homeWindow = true;
      this.homeModal = true;
      if (this.inGame) {
        socket.emit("leave-room", this.playerName, this.roomCode);
        this.inGame = false;
        document.querySelector('.buzz-inner-light').style.backgroundColor = "gray"  
      }
    },

    buzz() {
      if (canBuzz) {
        socket.emit("player-buzz", this.playerName, this.roomCode);
        document.querySelector('#team-1-buzzer').play();
        document.querySelector('.buzz-inner-light').style.backgroundColor = "red"
      }
    },

    clear() {
      socket.emit("mod-clear", this.roomCode);
      document.querySelector('.mod-buzz-player').innerText = "-----";
      document.querySelector('.mod-buzz-light').style.backgroundColor = "darkgreen"  
    }
  }
})