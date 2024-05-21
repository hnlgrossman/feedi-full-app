<template>
  <div id="thanks_page">
    <div class="text_container">
        <h2>הפרטים נקלטו בהצלחה!</h2>
        <p>תודה על המשוב שלך  
בזכותך אנחנו ממשיכים לשפר את חווית הלקוח שלנו כל יום !</p>
    </div>
    <div class="pic"></div>
  </div>
</template>

<script>
export default {

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