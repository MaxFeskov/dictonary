var dictList = [
    'equal',
    '1-3',
    '2-3',
    '2-3-d-t',
    '2-3-ee-et',
    '2-3-n',
    '2-3-t',
    '2-3-ught',
    '2-ew',
    '3-en',
    'i-a-u',
    'other',
  ];
  var dictBasePath = 'build/dictonary/verbs/';
  
  (function () {
    class Dictonary {
      constructor(lang, quickMode) {
        var JSONList = [];
  
        dictList.forEach(item => {
          JSONList.push(`${dictBasePath}${item}.json`);
        });
  
        this.lang = lang;
        this.quickMode = quickMode || false;
        this.questionEl = document.getElementById('question');
        this.answerEl = document.getElementById('answer');
        this.checkEl = document.getElementById('check');
        this.countEl = document.getElementById('count');
        this.needRepeatEl = document.getElementById('need-repeat');
        this.form = document.getElementById('form');
        this.getAnswerEl = document.getElementById('getanswer');
        this.number = 0;
        this.queue = [];
  
        loadJSONList(JSONList).then(data => {
          this.data = Object.assign({}, ...data);
  
          this.count = Object.keys(this.data).length;
          var totalcountEl = document.getElementById('total-count');
          if (totalcountEl) {
            totalcountEl.innerHTML = this.count;
          }
  
          for (var i = 0; i < this.count; i++) {
            this.queue.push(i);
          }
  
          this.queue.sort(() => Math.random() - 0.5);
          this.startCheck();
          this.initEvents();
        });
      }
  
      startCheck() {
        this.getQuestion();
      }
  
      initEvents() {
        if (this.form) {
          this.form.addEventListener('submit', (event) => {
            event.preventDefault();
            event.stopPropagation();
            this.checkAnswer();
            return false;
          })
        }
  
        if (this.getAnswerEl) {
          this.getAnswerEl.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            this.getAnswer();
  
            return false;
          })
        }
      }
  
      getQuestion() {
        if (this.answerEl && this.questionEl) {
          if (isObj(this.data) && !isEmptyObj(this.data)) {
            var question = Object.entries(this.data)[this.queue[this.number]][0];
            this.questionEl.innerHTML = question;
  
            if (this.countEl) {
              this.countEl.innerHTML = this.number + 1;
            }
          } else {
            if (this.countEl) {
              this.countEl.innerHTML = this.number;
              this.questionEl.innerHTML = 'done!!!';
            }
          }
        }
      }
  
      getNextQuestion() {
        this.number += 1;
  
        if (this.queue[this.number] != undefined) {
          this.getQuestion();
        } else {
          this.questionEl.innerHTML = 'done!!!';
        }
      }
  
      checkAnswer() {
        if (this.answerEl && this.questionEl) {
          if (isObj(this.data) && !isEmptyObj(this.data)) {
            var answers = this.answerEl.value.split(', ');
            var rightAnswers = this.data[this.questionEl.innerHTML];
            var count = answers.length;
  
            if (rightAnswers && count) {
              if (isEqualObj(answers, rightAnswers)) {
                this.answerEl.value = '';
                this.getNextQuestion();
              }
            }
          }
        }
      }
  
      getAnswer() {
        if (this.answerEl && this.questionEl) {
          if (isObj(this.data) && !isEmptyObj(this.data)) {
            var rightAnswers = this.data[this.questionEl.innerHTML];
  
            if (rightAnswers) {
              this.answerEl.value = rightAnswers.join(', ');
              var printAnswer = '';
              if (this.needRepeatEl) {
                var p = document.createElement('div');
                printAnswer = `"${this.questionEl.innerHTML}": ["${rightAnswers.join('", "')}"],`;
                p.innerHTML = printAnswer;
                this.needRepeatEl.appendChild(p);
              }

              if (this.quickMode) {
                if (this.form) {
                  var event = new Event('submit');
                  this.form.dispatchEvent(event);
                }
              }
            }
          }
        }
      }
    }
  
    var lang = window.location.search.substr(1);
    var dictonary = new Dictonary(lang, true);
   }());
  
   function loadJSON(url) {
    return fetch(url).then(r => r.json()).catch(() => console.log(`Error loaded ${url}`));
  }
  
  function loadJSONList(urlArr) {
    if (isArr(urlArr)) {
      var resultArr = [];
  
      urlArr.forEach(url => {
        resultArr.push(loadJSON(url));
      });
  
      return Promise.all(resultArr);
    }
  }
  
  function isArr(arr) {
    if (arr) return Array.isArray(arr);
  }
  function isObj(obj) {
    if (obj) return obj === Object(obj);
  }
  function isEmptyObj(object) {
    return JSON.stringify(object) === '{}';
  }
  function isEqualObj(obj1, obj2) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }