<template>
  <div id="results_page">
    <div class="bad_res" v-if="this.$route.params.status === 'bad'">
        <div class="text_container">
            <div class="title_pic_container">
                <h2 v-text="getLang(badTitle, lang)"></h2>
                <div class="pic"></div>
            </div>
            <p v-text="getLang(badText, lang)"></p>
        </div>
        <div class="loader pic"></div>
    </div>
    <div class="good_res" v-if="this.$route.params.status === 'good'">
        <div class="text_container">
            <div class="title_pic_container">
                <h2 v-text="getLang(goodTitle, lang)"></h2>
                <!-- <div class="pic"></div> -->
            </div>
            <p v-text="getLang(goodText, lang)"></p>
            <div class="stars pic"></div>
        </div>
        <div class="loader pic"></div>
    </div>
  </div>
</template>

<script>
export default {
    props: ['faqs', 'user', 'lang'],
    data() {
        return {
            goodTitle: {
                text: 'רק עוד רגע...',
                textEn: 'Just a moment...',
                textRu: 'Один Момент...',
            },
            badTitle: {
                text: 'נראה שלא אהבתם...',
                textEn: "Looks like you didn't like it...",
                textRu: 'Похоже, тебе это не понравилось...',
            },
            badText: {
                text: 'אתם מועברים לדף יצירת הקשר של המסעדה השאירו לנו פרטים ונציג שלנו יחזור אליכם בהקדם האפשרי',
                textEn: "You are transferred to the restaurant's contact page. Leave us your details and our representative will get back to you as soon as possible",
                textRu: "Вы будете перенаправлены на страницу контактов ресторана. Оставьте нам свои данные, и наш представитель свяжется с вами как можно скорее."
            },
            goodText: {
                text: 'הנך מועבר לדירוג הכוכבים של גוגל נשמח לדירוג הטוב ביותר :)',
                textEn: 'You are transferred to the Google star rating, we will be happy for the best rating :)',
                textRu: 'Вы переведены в звездный рейтинг Google, будем рады лучшей оценке :)',
            }
        }
    },
    mounted() {
        let time = 2000;
        let func;
        let start = Date.now();
        this.addFeedback()
        const timeTaken = Date.now() - start;
        time -= timeTaken
        if (this.$route.params.status === 'good') {
            func = () => {
                window.location = this.user.google_review_link
                this.$router.push({ name: 'results', params: { status: this.status.statusReview } })
            }
        } else {
            func = () => {
                this.$router.push({ name: 'contact' })
            }
        }
        setTimeout(func, time)
    },
    methods: {
        addFeedback() {
            this.api({action: 'feedback', data: { faqs: this.faqs}, method: 'post'},
                (data) => {
                    if (data) {
                    this.$emit('feedback', data)
                    // console.log(data);
                    }
                }, (error) => {
                    console.error(error.data);
                }
            )
        },
    }
}
</script>

<style lang="scss">
#results_page {
    &>div { padding: 60px var(--padding_inline);
        &.bad_res {}
        &.good_res {
            .stars { background-image: url('@/assets/stars.svg'); background-size: contain; width: auto; height: 11vw;}
            p {font-weight: bold;}
        }
        .text_container { display: flex; flex-direction: column; gap: var(--gap);
            .title_pic_container { display: flex; align-items: center; gap: var(--gap); justify-content: center;
                h2 { font-size: var(--h3); font-weight: bold; }
                .pic { background-image: url('@/assets/emogi.svg'); min-width: var(--h3); height: var(--h3); }
            }
            p { text-align: center;  font-size: var(--h4); line-height: 1;   }
        }
    }
}

</style>