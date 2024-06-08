<template>
  <div id="thanks_page">
    <div class="text_container">
        <h2 v-text="getLang(title, lang)"></h2>
        <p v-text="getLang(desc, lang)"></p>
    </div>
    <div class="pic"></div>
  </div>
</template>

<script>
export default {
  props: ['lang'],
  data() {
    return  {
      title: {
        text: 'הפרטים נקלטו בהצלחה!',
        textEn: 'The details have been received successfully!',
        textRu: 'Детали успешно получены!',
        textRo: 'Detaliile au fost primite cu succes!',

      },
      desc: {
        text: 'תודה על המשוב שלך בזכותך אנחנו ממשיכים לשפר את חווית הלקוח שלנו כל יום !',
        textEn: 'Thank you for your feedback, thanks to you we continue to improve our customer experience every day!',
        textRu: 'Благодарим вас за отзыв, благодаря вам мы продолжаем улучшать качество обслуживания клиентов каждый день!',
        textRo: 'Vă mulțumim pentru feedback, datorită vouă, continuăm să îmbunătățim experiența clienților noștri în fiecare zi!',
      }
    }
  }
}
</script>

<style lang="scss">
#thanks_page { padding: 60px var(--padding_inline); background: #4FA1FB; min-height: 100vh;  display: flex; flex-direction: column; gap: var(--gap_xl);
    .text_container { display: flex; flex-direction: column; gap: var(--gap_l); 
        h2 { font-style: var(--h1); font-weight: bold; text-align: center;}
        p { font-size: var(--h4); text-align: center;}
    }
    .pic { background-image: url('@/assets/check.svg'); width: 40vw; height: 40vw; margin: 0 auto; }
}
</style>