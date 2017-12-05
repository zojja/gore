Vue.component('hatchet', {
    props: ['info'],
    template: '<div v-on:click="checkHatchet" class="hatchet"></div>',
    methods: {
        checkHatchet: function () {
            (this.info) ? this.$root.resetTimer() : this.$root.failed();
        }
    }
});

var app = new Vue({
    el: '#app',
    data: {
        seconds: 10,
        year: new Date().getFullYear(),
        timerReference: '',
        isRunning: false,
        level: 1,
        attempts: 3,
        hatchets: [
            {info: true, id: 1},
            {info: false, id: 2},
            {info: false, id: 3}
        ]
    },
    methods: {
        decreaseSeconds: function() {
            this.seconds--;

            if (this.seconds === 0) {
                this.resetTimer();
            }
        },
        failed: function() {
            this.attempts--;
            this.resetTimer();
        },
        timerStart: function() {
            if (!this.isRunning && this.seconds > 0) {
                this.shuffleHatchets();
                this.timerReference = setInterval(this.decreaseSeconds, 1000);
                this.isRunning = true;
            }
        },
        resetTimer: function () {
            clearInterval(this.timerReference);
            this.seconds = 10;
            this.isRunning = false;
        },
        shuffleHatchets: function() {
            var guess_array = [
                {info: true},
                {info: false},
                {info: false}
            ]

            for (var i = guess_array.length - 1; i >= 0; i--) {
                var rand_index = Math.floor(Math.random() * (i + 1));
                var temp = guess_array[i];
                guess_array[i] = guess_array[rand_index];
                guess_array[rand_index] = temp;
            }

            this.hatchets = guess_array;
        },
        audio: function() {
            return {
                start: function() {
                    var audio = new Audio('../audio/start.mp3');
                    audio.play();
                },
                rules: function() {
                    var audio = new Audio('../audio/rules.mp3');
                    audio.play();
                }
            }
        }
    },
    created: function() {
        this.shuffleHatchets();
        this.audio().start();
    },
    components: {
        'first-screen': {
            template:
                '<div class="first-screen">\
                    <div class="first-screen__credits">ВИДЕО ИГРА: Геннадия Горина</div>\
                    <div class="first-screen__title"> УГАДАЙ <br> ТОПОР</div>\
                    <div class="hatchet"></div>\
                    <span class="next">Далее &raquo;</span>\
                </div>'
        },
        'rules': {
            template:
                '<div class="rules" style="display:none">\
                    <div class="hatchet"></div>\
                    <div class="rules__title">правила игры</div>\
                    <p>угадай топор в<br>течении 10 секунд</p>\
                    <div class="rules__title rules__title--green">справка</div>\
                    <p>в игре 10 раундов</p>\
                    <span class="next">Старт &raquo;</span>\
                </div>'
        },
        'try': {
            props: ['val'],
            template:
                '<div class="try" style="display:none">\
                    <div class="hatchet"></div>\
                    <div class="try__title">Раунд: {{ val }}</div>\
                </div >'
        },
        'main-screen': {
            props: ['hatchets'],
            template:
                '<div class="main" style="display:none">\
                    <hatchet \
                        v-for="hatchet in hatchets" \
                        v-bind:info="hatchet.info" \
                        v-bind:key="hatchet.id" \
                    ></hatchet>\
                </div >'
        }
    }
});