<template>
  <div id="welcome_page" v-if="user">
    <div class="langs" :class="{open: langsOpen}">
      <div class="pic" @click="selectLang(i)" :class="(lang === langItem.key ? 'active' : '') + ' ' + (langItem.key)" v-for="(langItem, i) in langs" :key="langItem.key"></div>
    </div>
    <div class="pic" :style="'--logo_url: url(' + user.logo +');'"></div>
    <div class="text_btn_container">
        <div class="text_container">
            <h3 v-text="getLang(user.title, lang)"></h3>
            <p v-text="getLang(user.description, lang)"></p>
        </div>
        <router-link :to="{ name: 'questions'}" class="btn big" >{{ getLang(btnText, lang) }}</router-link>
    </div>
  </div>
</template>

<script>
export default {
  props: ['user', 'lang', 'langs'],
  data() {
    return {
      langsOpen: false,
      title: {
        text: 'נשמח לקבל את הביקורת שלך',
        textEn: 'We would love to receive your review',
        textRu: 'Мы будем рады получить ваш отзыв',
        textRo: 'Ne-ar plăcea să primim recenzia dvs',
      },
      btnText: {
        text: 'מתחילים',
        textEn: 'starting',
        textRu: 'начиная',
        textRo: 'pornire',

      }
    }
  },
  mounted() {
    for (let i = 0; i < this.langs.length; i++) {
      if (this.langs[i].key === this.lang) {
        // console.log('====================================');
        // console.log(this.langs[i].key);
        // console.log('====================================')s;
        this.selectLang(i, false);
      }
      
    }
    // console.log(this.user)
  },
  methods: {
    selectLang(index, is_open=null) {
      this.$emit('changeLang', this.langs[index].key)
      this.$emit('changeLangs', this.array_move(this.langs, index, 0))
      if (is_open===null) this.langsOpen = !this.langsOpen;
      else this.langsOpen = this.is_open;
    }
  }
}
</script>

<style lang="scss">
#welcome_page { min-height: 100vh; display: flex; flex-direction: column; gap: var(--gap_xl);
  .langs {     position: absolute; top: 10px; right: 10px; width: 18vw; z-index: 1;display: flex; gap: var(--gap_small); flex-direction: column;
    &:not(.open){
      >:not(:first-child) { display: none;}
    }
    .pic { width: 100%; aspect-ratio: 16 / 9; 
      &.he { background-image: url('@/assets/he_flag.png');}
      &.en { background-image: url('@/assets/en_flag.png');}
      &.ru { background-image: url('@/assets/ru_flag.png');}
      &.ro { background-image: url('@/assets/ro_flag.png');}
    }
  }
  &>.pic { 
    // background-image: url('@/assets/feedi_logo_big.png'); 
    background-image: var(--logo_url); 
    background-size: cover; background-position: center; background-repeat: no-repeat; width: 100%; aspect-ratio: 16 / 9;  }
  .text_btn_container { display: flex; flex-direction: column;  gap: var(--gap_xl); padding-inline: var(--padding_inline);
    .text_container { text-align: center; display: flex; flex-direction: column; gap: var(--gap);
      h3 { font-size: var(--h3);}
      p { font-size: var(--h4);}
    }
    .btn { margin: 0 auto; width: 80%; transition: 0.3s; text-decoration: none;
      &:hover { transform: scale(1.05); }
    }
  }

}
</style>