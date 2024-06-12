<template>
    <div id="main_edit_form" >
    <addQuestionPopup @addQuestion="addQuestion" @updateQuestion="updateQuestion" :editQuestion="editQuestion" :active="addQuestionPopupOpen" @close="togglePopup"/>
    <div class="head">
        <div>
            <h1>טופס שאלות</h1>
            <p>מינימום 3 עד 5 שאלות</p>
        </div>
        <div class="icon_container" @click="togglePopup(true)">
            <i class="fas fa-plus"></i>
        </div>
    </div>
    <ul class="questions_container">
        <li @click="togglePopup(question)" class="question" v-for="question in questions" :key="question._id" >
            <div class="actions">
                <div class="delete" @click.stop="handleDelete(question._id)" ><i class="fa-solid fa-trash"></i></div>
            </div>
            <div class="text" v-text="question.text"></div>
            <div class="pic" :style="'background-image: url(' + getPic(question.pic) + ');'"></div>
        </li>
    </ul>
  </div>
</template>

<script>
import addQuestionPopup from '@/components/admin/addQuestionPopup.vue'

export default {
    props: ['user'],
    components: {addQuestionPopup},
    data() {
        return {
            editQuestion: null,
            addQuestionPopupOpen: false,
            questions: []
        }
    },
    mounted() {
        this.init();
        if (this?.user?.description?.text) {
            this.mainText = this.user.description.text
        }
    },
    methods: {
        togglePopup(data=false) {
            if (data) {
                
                if (typeof data === 'object') {
                    this.addQuestionPopupOpen = true
                    this.editQuestion = data;

                } else {
                    if (this.questions.length >= 5 ) {
                        alert('אין להוסיף יותר מ 5 שאלות');
                        return;
                    }
                    this.addQuestionPopupOpen = true
                }
                
            } else {
                this.addQuestionPopupOpen = false;
                if (this.editQuestion) {
                    this.editQuestion = null;
                }
            }
        },
        init() {
            this.api({ action: 'question?user_id=' + this.user._id, data: {...this.formData}, method: 'get'}, 
                (data) => {
                    if (data) {
                        this.questions = data;
                    }
                }, (error) => {
                    console.error(error.data, 'hnl');
                }
            )
        },
        
        handleDelete(id) {
            this.api({ action: 'question/' + id, data: {}, method: 'delete'}, 
                (data) => {
                    if (data) {
                        this.questions = this.questions.filter(item => item._id != id);
                    }
                }, (error) => {
                    console.error(error.data, 'hnl');
                }
            )
        },
        addQuestion() {
            this.togglePopup()
            
            // setTimeout(() => { this.addQuestionPopupOpen=false; }, 700)
            this.init()
        },
        updateQuestion() {
            // setTimeout(() => { this.addQuestionPopupOpen=false; }, 700)
            // this.editQuestion = false;
            this.togglePopup()
            this.init();
        }
    }
}
</script>

<style lang="scss">
#main_edit_form { padding-block: 30px; padding-inline: var(--padding_inline); display: flex; flex-direction: column; gap: var(--gap_l); min-height: calc(100vh - var(--headerHeight));
    .head { display: flex; align-items: center; justify-content: space-between; 
        h2 { line-height: 1; }
        p {font-size: var(--h5);}
        .icon_container { width: 48px; height: 48px; border-radius: 50%; background: var(--color); display: flex; align-items: center; justify-content: center; 
            i, svg { font-size: 22px; color: #fff; }
        }
    }
    .questions_container { display: flex; flex-direction: column; gap: var(--gap);
        --local_padding: 12px;
        .main_text { display: flex; flex-direction: column; gap: var(--gap_small);
            textarea { line-height: 1.2em; height: 4.6em; }
            .btn { position: relative; width: 100%; text-align: center; font-size: var(--h4); 
                &:not(.active) { 
                    &::after { content: ''; position: absolute; inset: 0; background: #fff; opacity: 0.4;}
                }
            }
        }
        li { display: flex; gap: var(--gap_small); padding: var(--local_padding); border-radius: var(--radius_small); background: var(--color);
            .text { flex: 2; color: #000;}
            .pic {background-color: #fff;flex: 1; aspect-ratio: 16 / 9; border-radius: calc(var(--radius_small) - (var(--local_padding) / 2));}
            .delete { display: flex; width: 28px; height: 28px; border-radius: 50%; background: #EAEAEA; align-items: center; justify-content: center;
                i, svg { color: var(--color); font-size: 16px }
            }
        }
    }
}
</style>