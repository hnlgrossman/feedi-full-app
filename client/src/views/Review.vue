<template>
    <div v-if="loaded" id="main_review_page" :style="'--color: ' + user.mainColor + '; '" :class="lang + '_lang'" :dir="lang === 'he' ? 'rtl' : 'ltr'" > 
        <!-- <div v-if="user"> -->
            <!-- <transition name="fade" mode="out-in">
              <component :is="Component" :key="$route.path" />
            </transition> -->
            <transition name="fade" mode="out-in">
                <router-view :isSendFeedback="isSendFeedback" :lang="lang" :langs="langs" @changeLang="lang=$event" @changeLangs="langs=$event" @feedback="feedback=$event; isSendFeedback=true" :feedback="feedback"  @faqs="faqs=$event" :faqs="faqs" class="child-view" :user="user" ></router-view>
            </transition>
                <!-- </div> -->
    </div>
    <div v-else><div class="loader pic"></div></div>
</template>

<script>
// import WelcomePage from '../components/review/welcome.vue'
export default {
    // components: { WelcomePage, },
    data() {
        return {
            loaded:false,
            user: null,
            faqs: null,
            feedback: null,
            isSendFeedback: false,
            lang: 'he',
            langs: [
                {key: 'he', pic: 'he_flag.png'},
                {key: 'en', pic: 'en_flag.png'},
                {key: 'ru', pic: 'ru_flag.png'},
                {key: 'ro', pic: 'ro_flag.png'},
            ]
        }
    },
    mounted() {
        this.api({ action: 'user/' + this.$route.params.user_id, data: {}, method: 'get'}, (data) => {
            if (data) {
                this.user = data;
                this.lang = this.user?.selectedLang || 'he'
            } else {
                alert('עסק לא נמצא');
                window.location = '/'
            }
            this.loaded = true;
        })
        
        if ( this.$route.name === 'review') {
            this.$router.push({ name: 'welcome'})
            // this.$router.push({ name: 'welcome'})
        }
    }

}
</script>

<style lang="scss">
#main_review_page {
    &:not(.he_lang) { direction: ltr;}
}
    .fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>