<template>
  <div id="contact_page">
    <h2 v-text="getLang(title, lang)"></h2>
    <form @submit.prevent="updateFeedback">
        <ul>
            <li class="label_input_transition" :class="{ active: formData.note}">
                <span color="red" style="color: red;" v-text="getLang(filed_req, lang)"></span>
                <textarea v-model="formData.note" type="text" name="note" id="note" required></textarea>
                <label for="note" v-text="getLang(note, lang)"></label>
            </li>
            <li class="label_input_transition" :class="{ active: formData.name}">
                <input v-model="formData.name" type="text" name="first_name" id="first_name">
                <label for="first_name" v-text="getLang(firstName, lang)"></label>
            </li>
            <li class="label_input_transition" :class="{ active: formData.phone}">
                <input v-model="formData.phone" type="tel" name="tel" id="phone">
                <label for="phone" v-text="getLang(phone, lang)"></label>
            </li>
        </ul>
        <input type="submit" class="btn big" :value="getLang(submit_text, lang)">
    </form>
  </div>
</template>

<script>
export default {
    props: ['feedback', 'lang'],
    data() {
        return {
            formData: {
                name: '',
                phone: '',
                note: ''
            },
            title: {
                text: 'השאירו לנו פרטים ונציג שלנו יחזור אליכם בהקדם האפשרי',
                textEn: 'Leave us details and our representative will get back to you as soon as possible',
                textRu: 'Оставьте нам данные и наш представитель свяжется с вами в ближайшее время.',
                textRo: 'Lăsați-ne detalii și reprezentantul nostru vă va contacta cât mai curând posibil'
            },
            firstName: {
                text: 'שם פרטי',
                textEn: 'First name',
                textRu: 'Имя',
                textRo: 'Nume',
            },
            phone: {
                text: 'טלפון',
                textEn: 'phone',
                textRu: 'телефон',
                textRo: 'telefon',
            },
            note: {
                text: 'הערות נוספות',
                textEn: 'Additional Comments',
                textRu: 'Дополнительные комментарии',
                textRo: 'Comentarii suplimentare',
            },
            submit_text: {
                text: 'שלח',
                textEn: 'Send',
                textRu: 'Отправлять',
                textRo: 'Trimite',
            },
            filed_req: {
                text: 'שדה חובה',
                textEn: 'Required field',
                textRu: 'Обязательное поле',
                textRo: 'Câmp obligatoriu',
            }
        }
    },
    mounted() {

    },
    methods: {
        updateFeedback() {
            this.api({action: 'feedback/' + this.feedback._id, data: {...this.formData}, method: 'put'},
                (data) => {
                    if (data) {
                        this.$router.push({ name: 'thanks' })
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
#contact_page { padding: 60px var(--padding_inline); display: flex; flex-direction: column; gap: 80px;
    h2 { text-align: center; font-size: var(--h3); font-weight: bold; }
    form { display: flex; flex-direction: column; gap: var(--gap_xl);
        ul { display: flex; flex-direction: column; gap: var(--gap_l);
            li {  
                label { font-weight: normal;}
            }
        }
        textarea, input[type=text], input[type=tel] { background: #EAEAEA; }
        .btn { width: 85%; margin: 0 auto;}
    }
}
</style>