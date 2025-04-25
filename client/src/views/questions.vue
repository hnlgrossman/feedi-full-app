<template>
  <!-- dev-c -->
  <div id="questions_page" v-if="user"> 
    <div class="pic" :style="'background-image: url(' + getPic(currentQuestion.pic) + ')'" ></div>
    <div class="question_answers_process_container">
      <div class="question_process_container">
        
        <div class="process_status_container">
          <p class="status" v-text="status.text"></p>
          <div class="process_num_container">
            <p class="status_nums">
              <span v-text="`${status.presents == 100 ? currentStep : currentStep - 1}/${user.questions.length}`"></span>
            </p>
            <div class="process_bar" :style="'--process: ' + status.presents + '%;'"></div>
          </div>
        </div>
        <p class="question" v-text="getLang(currentQuestion, lang)"></p>
      </div>
      <div :style="`--text: '` + getLang(firstSelect, lang) + `'`" class="answers_container" v-click-away="() => {confirmAnswerIndex = null}" :class="{ answer_select: confirmAnswerIndex != null, first: currentStep === 1}">
        <div class="answer" :class="{selected: confirmAnswerIndex === 0}" @click="addAnswer(4, 0)">
          <img src="@/assets/imoges/emazing.png" :alt="getLang({ 
            text: 'היה מדהים!', 
            textEn: 'It was amazing!', 
            textRu: 'Было потрясающе!', 
            textRo: 'A fost uimitor!' 
          }, lang)" />
          <p class="answer_text">{{ getLang({ 
            text: "היה מדהים!", 
            textEn: "It was amazing!", 
            textRu: "Было потрясающе!", 
            textRo: "A fost uimitor!" 
          }, lang) }}</p>
        </div>
        <div class="answer" :class="{selected: confirmAnswerIndex === 1}" @click="addAnswer(3, 1)">
          <img src="@/assets/imoges/liked.png" :alt="getLang({ 
            text: 'אהבתי', 
            textEn: 'I liked it', 
            textRu: 'Мне понравилось', 
            textRo: 'Mi-a plăcut' 
          }, lang)" />
          <p class="answer_text">{{ getLang({ 
            text: "אהבתי", 
            textEn: "I liked it", 
            textRu: "Мне понравилось", 
            textRo: "Mi-a plăcut" 
          }, lang) }}</p>
        </div>
        <div class="answer" :class="{selected: confirmAnswerIndex === 2}" @click="addAnswer(2, 2)">
          <img src="@/assets/imoges/mid.png" :alt="getLang({ 
            text: 'צריך שיפור', 
            textEn: 'Needs improvement', 
            textRu: 'Требует улучшения', 
            textRo: 'Necesită îmbunătățiri' 
          }, lang)" />
          <p class="answer_text">{{ getLang({ 
            text: "צריך שיפור", 
            textEn: "Needs improvement", 
            textRu: "Требует улучшения", 
            textRo: "Necesită îmbunătățiri" 
          }, lang) }}</p>
        </div>
        <div class="answer" :class="{selected: confirmAnswerIndex === 3}" @click="addAnswer(1, 3)">
          <img src="@/assets/imoges/bad.png" :alt="getLang({ 
            text: 'גרוע', 
            textEn: 'Terrible', 
            textRu: 'Плохо', 
            textRo: 'Groaznic' 
          }, lang)" />
          <p class="answer_text">{{ getLang({ 
            text: "גרוע", 
            textEn: "Terrible", 
            textRu: "Плохо", 
            textRo: "Groaznic" 
          }, lang) }}</p>
        </div>
      </div>
      <div class="navigation_buttons" v-if="currentStep > 1">
        <button class="prev_button" @click="goToPrevQuestion">{{ getLang({ 
          text: "שאלה קודמת", 
          textEn: "Previous question", 
          textRu: "Предыдущий вопрос", 
          textRo: "Întrebarea anterioară" 
        }, lang) }}</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['user', 'lang'],
  data() {
    return {
      confirmAnswerIndex: null,
      finishProcess: false, 
      formData: {
        faqs: []
      },
      firstSelect: {
        text: 'לחיצה נוספת לאישור',
        textRu: 'Нажмите еще раз, чтобы подтвердить',
        textEn: 'Click again to confirm',
        textRo: 'Faceți clic din nou pentru a confirma',
      },
      statusText: [
        {
          "text": "רק כמה שאלות לפניך",
          "textRu": "Только пару вопросов",
          "textEn": "Only a few questions",
          "textRo": "Doar câteva întrebări pentru tine",
        },
        {
          "text": "עוד כמה צעדים",
          "textRu": "Еще несколько шагов",
          "textEn": "A few more steps",
          "textRo": "Câteva pași înainte",
        },
        {
          "text": "עברת חצי מהדרך",
          "textRu": "Прошли уже пол пути",
          "textEn": "Halfway through",
          "textRo": "La jumătatea drumului în spatele tău",
        },
        {
          "text": "כמעט סיימנו",
          "textRu": "Почти закончили",
          "textEn": "Almost done",
          "textRo": "Aproape am terminat",
        },
        {
          "text": "שאלה אחרונה ודי",
          "textRu": "Последний вопрос и все",
          "textEn": "One last question",
          "textRo": "O ultima intrebare",
        },
        {
          "text": "תודה על הפידבק!",
          "textRu": "Спасибо за обратную связь!",
          "textEn": "Thank you for the feedback!",
          "textRo": "Mulțumesc pentru feedback!",
        }
      ]
      
    }
  },
  methods: {
    addAnswer(rating, answerIndex) {
      const question_id = this.currentQuestion?._id;
      // this.confirmAnswerIndex = answerIndex;
      
      const existingIndex = this.formData.faqs.findIndex(item => item.question === question_id)
      if (existingIndex > -1) this.formData.faqs.splice(existingIndex, 1);
      this.formData.faqs.push( { rating, question: question_id, answer_text: this.currentQuestion.answers[answerIndex].text, question_text: this.currentQuestion.text } )
      
      if (this.currentStep < this.user.questions.length) {
        this.$router.push({ params: { step: this.currentStep + 1 }})
      } else {
        this.finishProcess = true
        this.$emit('faqs', this.formData.faqs)
        
        setTimeout(() => {
          // apdate the db dev-c
          this.$router.push({ name: 'results', params: { status: this.status.statusReview} })
        }, 700)
      }
    },
    goToPrevQuestion() {
      if (this.currentStep > 1) {
        this.$router.push({ params: { step: this.currentStep - 1 }})
      }
    }
  },
  computed: {
    // currentQuestionText() {
    //   if (this.lang === 'en') return this.currentQuestion.textEn;
    //   if (this.lang === 'ru') return this.currentQuestion.textRu;
    //   if (this.lang === 'ro') return this.currentQuestion.textRo;
    //   else return this.currentQuestion.text;
    // },
    currentStep() {
      if ((+this.$route.params.step || 1) <= this.user.questions.length) {
        return (+this.$route.params.step || 1)
      } else {
        return this.user.questions.length
      }
    },
    currentQuestion() {
      if (this.user.questions.length < this.currentStep ) {
        return this.user.questions[this.user.questions.length - 1]
      }
      return this.user.questions[this.currentStep - 1];
    },
    status() {
      let statusReview = 'bad'
      let presents;
      if (this.finishProcess) {
        presents = 100
      } else {
        presents = ((this.currentStep - 1) / (this.user.questions.length ) ) * 100;
      }
      let statusTextIndex = parseInt(( presents / (presents / (this.currentStep)) - 1))
      if (presents === 0) {statusTextIndex = 0}
      if (this.currentStep === this.user.questions.length) {statusTextIndex = 4}
      if (presents === 100) {statusTextIndex = 5}
      // console.log(presents, this.currentStep, statusTextIndex);
      let text = this.getLang(this.statusText[statusTextIndex], this.lang);

      // statusReview
      // console.log(Math.round(parseFloat(this.formData.faqs.length / 2)), this.formData.faqs.filter(item => item.rating === 4).length);
      // Math.round(parseFloat(this.formData.faqs.length / 2)) <= this.formData.faqs.filter(item => item.rating === 4).length
      if (this.formData.faqs.filter(item => item.rating < 3).length === 0) {
        statusReview = 'good'
      }

      return { text, presents, statusReview}
    }
  }
}
</script>

<style lang="scss">
#questions_page { min-height: 100vh; display: flex; flex-direction: column; gap: var(--gap_xl);
  .pic { width: 100%; aspect-ratio: 16 /9; }
  .question_answers_process_container { padding-inline: var(--padding_inline); display: flex; flex-direction: column; gap: 74px;
    .question_process_container { display: flex; flex-direction: column; gap: var(--gap); 
      .question { font-size: var(--h4); text-align: center; font-weight: 600; }
      .process_status_container { display: flex; flex-direction: column; gap: var(--gap_small);
        .status { font-size: var(--h5); }
        .process_num_container { display: flex; align-items: center; gap: var(--gap_small);
          .process_bar { display: flex; justify-content: flex-end; flex: 1; height: 14px; padding: 2px; border-radius: 8px; background: #D9D9D9; 
            &::after { content: '';  transition: 0.3s width; height: 100%; width: var(--process); background: #007AFF; display: block;  border-radius: 6px; }
          }
        }
      }
    
    }
    
  }
  .answers_container { 
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: var(--gap_small);
    max-width: 100%;
    margin: 0 auto;
    width: 100%;
    
    &.answer_select {
      .answer:not(.selected) { opacity: 0.5;}
    }
    
    .answer {
      cursor: pointer; 
      transition: 0.2s all; 
      opacity: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      flex: 1;
      gap: 8px;
      border-radius: var(--radius);
      
      img {
        width: 48px;
        height: 48px;
        object-fit: contain;
      }
      
      &.selected { 
        position: relative;
        &::after { 
          content: var(--text); 
          font-size: 12px; 
          position: absolute;
          bottom: -20px;
          left: 0;
          right: 0;
          text-align: center;
        }
      }
      
      .answer_text { 
        font-size: 14px; 
        font-weight: 500;
      }
    }
  }
  .navigation_buttons {
    display: flex;
    justify-content: center;
    margin-top: -40px;
    
    .prev_button {
      background-color: transparent;
      border: 1px solid #ccc;
      border-radius: var(--radius);
      padding: 8px 20px;
      cursor: pointer;
      font-size: 16px;
      transition: all 0.2s;
      
      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }
    }
  }
}
</style>