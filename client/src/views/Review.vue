<template>
    <div id="main_review_page" :class="lang + '_lang'" :dir="lang === 'he' ? 'rtl' : 'ltr'" > 
        <!-- <div v-if="user"> -->
            <!-- <transition name="fade" mode="out-in">
              <component :is="Component" :key="$route.path" />
            </transition> -->
            <transition name="fade" mode="out-in">
                <router-view :lang="lang" :langs="langs" @changeLang="lang=$event" @changeLangs="langs=$event" @feedback="feedback=$event" :feedback="feedback"  @faqs="faqs=$event" :faqs="faqs" class="child-view" :user="user" ></router-view>
            </transition>
                <!-- </div> -->
    </div>
</template>

<script>
// import WelcomePage from '../components/review/welcome.vue'
export default {
    // components: { WelcomePage, },
    data() {
        return {
            user: null,
            faqs: null,
            feedback: null,
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
            } else {
                alert('עסק לא נמצא');
                window.location = '/'
            }
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