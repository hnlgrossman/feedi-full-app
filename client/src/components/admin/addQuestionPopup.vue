<template>
  <div id="add_question_popup" :class="{active: active}">
    <div class="content">
        <div class="head">
            <h2>הוספת שאלה</h2>
            <div class="close" @click="close"><i class="fas fa-times"></i></div>
        </div>
        <!-- <form @submit.prevent="onSubmit">
        <div class="fields">
            <label>Upload File</label><br />
            <input type="file" ref="file" @change="onSelect" />
        </div>
        <div class="fields">
            <button>Submit</button>
        </div>
        </form> -->
        <form @submit.prevent="editQuestion ? updateQuestion() : addQuestion()">
            <div class="question_text ">
                <input type="text" v-model="formData.text" placeholder="שאלה" required>
            </div>
            <uploadFile v-model="formData.pic" :text="'העלה תמונה לשאלה'" />
            <input class="btn" type="submit" :value="editQuestion ? 'עדכן שאלה' : 'הוסף שאלה'">
        </form>
        <p class="msg" v-text="msg.text" :style="{color: msg.color}" v-if="msg.text"></p>
    </div>

  </div>
</template>

<script>
import uploadFile from '../uploadFile.vue';
export default {
    props: ['active', 'editQuestion'],
    components: { uploadFile },
    data() {
        return {
            filesToDelete: [ ],
            formData: {
                text: '',
                pic: ''
            },
            msg: {
                color: '',
                text: ''
            },
            

        }
    },
    mounted() {
        
        // this.deleteFiles()
    },
    methods: {
        close( time=0) {
            setTimeout(() => { 
                this.$emit('close'); 
                // }
                this.formData = {
                text: '',
                pic: ''
            }
            }, time)
              
            
        },
        
        validate() {
            if (!this.formData.text ) {
                this.msg.text = "טקסט חובה";
                this.msg.color = "red";
                return;
                // isValidate = false
            }
            if (!this.formData.pic ) {
                this.msg.text = "תמונה חובה";
                this.msg.color = "red";
                return;
            }
            return true;
            // retue
        },
        resetForm() {
            this.formData = {
                text: '',
                pic: ''
            }
        },
        addQuestion() {
            if (!this.validate()) return false;
            this.api({ action: 'question', data: {...this.formData}, method: 'post'}, 
            (data) => {
                if (data) {
                    this.msg = { text: 'שאלה נוספה בהצלחה', color: 'var(--color)'}
                    this.$emit('addQuestion', data);
                    // this.close()
                    this.resetForm()
                }
            }, (error) => {
                console.error(error.data, 'hnl');
            })
            this.$emit('close');
        },
        updateQuestion() {
            if (!this.validate()) return false;
            this.api({ action: 'question/' + this.editQuestion._id, data: { text: this.formData.text, pic: this.formData.pic}, method: 'put'}, 
                (data) => {
                    if (data) {
                        this.msg = { text: 'שאלה עודכנה בהצלחה', color: 'var(--color)'}
                        this.$emit('updateQuestion', data);
                        // this.close()
                        this.resetForm()
                        
                    }
                }, (error) => {
                    console.error(error.data, 'hnl');
                }
            )
        },
        
        
    },
    watch: {
        editQuestion() {
            if (this.editQuestion) {
                this.formData = this.editQuestion;
            }
        },
        active() {
            this.msg = {
                color: '',
                text: ''
            }
        }
    }
}
</script>

<style lang="scss">
#add_question_popup { transition: 0.3s all; position: fixed; inset: 0; z-index: 10;
    // &::after { content: ''; pointer-events: none; position: absolute; inset: 0; background: rgba(55, 55, 55, 0.3);}
    
    &:not(.active) {  background: rgba(55, 55, 55, 0); pointer-events: none; }
    &.active { background: rgba(55, 55, 55, 0.3); 
        .content {  top: 50%; }
    }
    .content { transition: 0.3s all; position: absolute; top: -100%; right: 50%; width: 90%; transform: translate(50%, -50%); display: flex; flex-direction: column; gap: var(--gap_l); background: #fff; border-radius: var(--radius); padding: var(--padding_inline);

        .head { display: flex; align-items: center; justify-content: space-between; 
            .close { font-size: 22px;}
        }
        form { display: flex; flex-direction: column; gap: var(--gap);
            input[type=text] { background: #EAEAEA; }
            .btn { margin: 0 auto;}

        }
        .msg { color: var(--color); text-align: center; font-weight: bold; font-size: var(--h4);}
    }
}
</style>