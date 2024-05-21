<template>
  <!-- dev-c -->
  <div id="questions_page" v-if="user"> 
    <div class="pic" :style="'background-image: url(' + getPic(currentQuestion.pic) + ')'" ></div>
    <div class="question_answers_process_container">
      <div class="question_process_container">
        <p class="question" v-text="getLang(currentQuestion, lang)"></p>
        <div class="process_status_container">
          <p class="status" v-text="status.text"></p>
          <div class="process_bar" :style="'--process: ' + status.presents + '%;'"></div>
        </div>
      </div>
      <div :style="`--text: '` + getLang(firstSelect, lang) + `'`" class="answers_container" v-click-away="() => {confirmAnswerIndex = null}" :class="{ answer_select: confirmAnswerIndex != null, first: currentStep === 1}">
        <div class="answer btn" ref="answer" :class="{selected: confirmAnswerIndex === i}" @click="addAnswer(answer.value, currentQuestion._id, i)" v-for="(answer, i) in currentQuestion.answers" :key="i">
          <p class="answer_text" v-text="getLang(answer, lang)"></p>
          <!-- <span v-text=""></span> -->
        </div>
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
      // user: {
      //   questions: [
      //     { id: 1, text: 'מה דעתך על השירות שקיבלת אצלנו ?', pic: 'https://i.ibb.co/bX4jF2z/image-2.png', answers: [
      //       { value: 1, text: 'גרוע'},
      //       { value: 2, text: 'חייב שיפור'},
      //       { value: 3, text: 'ממש טוב'},
      //       { value: 4, text: 'וואו, אהבתי'}
      //     ]},
      //     { id: 2, text: 'מה דעתך על האוכל  ?', pic: 'https://i.ibb.co/bX4jF2z/image-2.png', answers: [
      //       { value: 1, text: 'גרוע'},
      //       { value: 2, text: 'חייב שיפור'},
      //       { value: 3, text: 'ממש טוב'},
      //       { value: 4, text: 'וואו, אהבתי'}
      //     ]},
      //     { id: 3, text: 'מה דעתך על המוחות אצלנו ?', pic: 'https://i.ibb.co/bX4jF2z/image-2.png', answers: [
      //       { value: 1, text: 'גרוע'},
      //       { value: 2, text: 'חייב שיפור'},
      //       { value: 3, text: 'ממש טוב'},
      //       { value: 4, text: 'וואו, אהבתי'}
      //     ]},
      //   ]
      // },
      finishProcess: false, 
      formData: {
        faqs: []
      },
      firstSelect: {
        text: 'לחיצה נוספת לאישור',
        textRu: 'Нажмите еще раз, чтобы подтвердить',
        textEn: 'Click again to confirm'
      },
      statusText: [
  {
    "text": "רק כמה שאלות לפניך",
    "textRu": "Только пару вопросов",
    "textEn": "Only a few questions"
  },
  {
    "text": "עבודה טובה המשך כך",
    "textRu": "Хорошая работа, продолжайте",
    "textEn": "Good job, keep on going"
  },
  {
    "text": "חצי דרך מאחוריך",
    "textRu": "Прошли уже пол пути",
    "textEn": "Halfway through"
  },
  {
    "text": "כמעט סיימנו",
    "textRu": "Почти закончили",
    "textEn": "Almost done"
  },
  {
    "text": "שאלה אחרונה ודי",
    "textRu": "Последний вопрос и все",
    "textEn": "One last question"
  },
  {
    "text": "אלוף",
    "textRu": "good",
    "textEn": "good"
  }
]


    }
  },
  methods: {
    
    addAnswer(rating, question_id, answerIndex) {
      if (this.confirmAnswerIndex === answerIndex) {
        this.confirmAnswerIndex = null
        const existingIndex = this.formData.faqs.findIndex(item => item.question === question_id)
        if (existingIndex > -1) this.formData.faqs.splice(existingIndex, 1);
        this.formData.faqs.push( { rating, question: question_id} )
        // this.$route.push({ params: { step: this.currentStep + 1 }})
        // alert(1)
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
      } else {
        this.confirmAnswerIndex = answerIndex;
      }
    }
  },
  computed: {
    // currentQuestionText() {
    //   if (this.lang === 'en') return this.currentQuestion.textEn;
    //   if (this.lang === 'ru') return this.currentQuestion.textRu;
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
      console.log(presents, this.currentStep, statusTextIndex);
      let text = this.getLang(this.statusText[statusTextIndex], this.lang);
      return { text, presents, statusReview}
    }
  }
}
</script>

<style lang="scss">
#questions_page { min-height: 100vh; display: flex; flex-direction: column; gap: var(--gap_xl);
  .pic { width: 100%; aspect-ratio: 16 /9; }
  .question_answers_process_container { padding-inline: var(--padding_inline); display: flex; flex-direction: column; gap: var(--gap_xl);
    .question_process_container { display: flex; flex-direction: column; 
      .question { font-size: var(--h4); }
      .process_status_container {
        .status { font-size: var(--h5); }
        .process_bar { display: flex; justify-content: flex-end; width: 100%; height: 14px; padding: 2px; border-radius: 8px; background: #D9D9D9; 
          &::after { content: '';  transition: 0.3s width; height: 100%; width: var(--process); background: var(--color); display: block;  border-radius: 6px; }
        }
      }
    
    }
    
  }
  .answers_container { display: grid; grid-template-columns: 1fr 1fr; gap: var(--gap_small);
    &.answer_select {
      .answer:not(.selected) { opacity: 0.5;}
    }
    &.first {
      .answer {
        &.selected { 
          &::after { content: var(--text); background-image: none; font-size: 15px; display: flex; align-items: center; justify-content: center; text-align: center; width: 100%; }
        }
      }
    }
    .answer { cursor: pointer; transition: 0.2s opacity; opacity: 1; width: 100%; aspect-ratio: 16 / 8; display: flex; justify-content: center; align-items: center; border-radius: var(--radius);
      &.selected {  
        &::after { content: ''; height: 100%; aspect-ratio: 1; background-image: url('@/assets/Check_ring_light.svg'); background-position: center; background-size: contain; background-repeat: no-repeat;  }
        
        .answer_text { display: none; }
      }
      .answer_text { font-size: var(--h6); width: fit-content; }
    }
  }
}
</style>