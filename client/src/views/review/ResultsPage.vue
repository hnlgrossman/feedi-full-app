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
    props: ['faqs', 'user', 'lang', 'isSendFeedback'],
    data() {
        return {
            goodTitle: {
                text: 'רק עוד רגע...',
                textEn: 'Just a moment...',
                textRu: 'Один Момент...',
                textRo: 'O clipă...',
            },
            badTitle: {
                text: 'נראה שלא אהבתם...',
                textEn: "Looks like you didn't like it...",
                textRu: 'Похоже, тебе это не понравилось...',
                textRo: 'Se pare ca nu ti-a placut...',
            },
            badText: {
                text: 'אתם מועברים לדף יצירת הקשר שלנו נשמח למשוב מלא מה לא אהבתם אצלנו',
                textEn: "You are transferred to our contact page. We will be happy to receive full feedback on what you didn't like about us.",
                textRu: "Вы перенаправлены на нашу страницу контактов. Мы будем рады получить полный отзыв о том, что вам не понравилось в нас.",
                textRo: "Sunteți transferat la pagina noastră de contact. Ne-ar face plăcere să primim un feedback complet despre ce nu v-a plăcut la noi.",
            },
            goodText: {
                text: 'הנך מועבר לדירוג הכוכבים של גוגל נשמח לדירוג הטוב ביותר :)',
                textEn: 'You are transferred to the Google star rating, we will be happy for the best rating :)',
                textRu: 'Вы переведены в звездный рейтинг Google, будем рады лучшей оценке :)',
                textRo: 'Sunteți transferat la evaluarea cu stele Google, vom fi fericiți pentru cea mai bună evaluare :)',
            }
        }
    },
    mounted() {
        let time = 2000;
        let func;
        let start = Date.now();
        if (!this.isSendFeedback) {
            this.addFeedback();
        } 
        // else {
        //     this.$router.replace({ name: 'review', params: {user_id: this.user._id}})
        // }
        const timeTaken = Date.now() - start;
        time -= timeTaken
        if (this.$route.params.status === 'good') {
            func = () => {
                window.location = this.user.google_review_link
                // this.$router.push({ name: 'results', params: { status: this.status.statusReview } })
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
            this.api({action: 'feedback', data: { faqs: this.faqs, user_id: this.user._id, is_good: this.$route.params.status === 'good' }, method: 'post'},
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