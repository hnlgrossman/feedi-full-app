<template>
    <div id="main_edit_form" >
        <div class="head">
            <div>
                <h1>פרטים כלליים</h1>
                <!-- <p>מינימום 3 עד 5 שאלות</p> -->
            </div>
        </div>
        <ul class="questions_container">
            <div class="btn" @click="editMainText" :class="{ active: isFormChange}">עדכן פרטים</div>
            <div class="main_title">
                <label >עריכת כותרת ראשית</label>
                <input type="text" v-model="formData.title.text">
            </div>
            <div class="main_text">
                <label >עריכת טקסט ראשי</label>
                <textarea v-model="formData.description.text"></textarea>
            </div>
            <div class="logo_input">
                <label >לוגו</label>
                <uploadFile v-model="formData.logo" folder="logos" :text="'העלה את לוגו העסק'" />
            </div>
            <div class="color_input">
                <label >בחר צבע ראשי</label>
                <input type="color" v-model="formData.mainColor">
            </div>
            <div class="lang_input">
                <label >בחר שפה ראשית</label>
                <select required name="user_type" v-model="formData.selectedLang">
                    <option value="">בחר שפה</option>
                    <option value="he">עברית</option>
                    <option value="en">אנגלית</option>
                    <option value="ru">רוסית</option>
                    <option value="ro">רומנית</option>
                </select>
            </div>
        </ul>
  </div>
</template>

<script>
import uploadFile from '../../components/uploadFile.vue';

export default {
    props: ['user'],
    components: {uploadFile},
    data() {
        return {
            isFormChange: false,
            dataLoaded: false,
            formData: {
                description: {
                    text: null,
                },
                title: {
                    text: null,
                },
                logo: null,
                mainColor: null,
                selectedLang: null,
            }
        }
    },
    mounted() {
        this.init();
        // if (this?.user?.description?.text) {
            // }
        this.formData.description.text = this.user?.description?.text
        this.formData.title.text = this.user?.title?.text
        this.formData.logo = this.user?.logo
        this.formData.mainColor = this.user?.mainColor
        this.formData.selectedLang = this.user?.selectedLang
        
        this.dataLoaded = true;
    },
    methods: {
        editMainText() {
            if (this.isFormChange) {
                this.isFormChange = false;
                const data = this.formData;
                this.api({ action: 'user/update_user?user_id=' + this.user._id, data, method: 'put'}, 
                    // (data) => {
                    //     if (data) {
                    //         console.log(data);
                    //     }
                    // }, (error) => {
                    //     console.error(error.data, 'hnl');
                    // }
                )
            }
        },
        init() {
            
        },
        
    },
    watch: {
        formData: {
            handler: function () { 
                // ( ((this.isFormChange && this.dataLoaded) || !this.dataLoaded) ? null : this.isFormChange = true)
                if (!this.isFormChange && this.dataLoaded) {
                    this.isFormChange = true
                }
            },
            deep: true
        }
    }
}
</script>

<style lang="scss">
#main_edit_form { padding-block: 30px 100px; padding-inline: var(--padding_inline); display: flex; flex-direction: column; gap: var(--gap_l); min-height: calc(100vh - var(--headerHeight));
    .head { display: flex; align-items: center; justify-content: space-between; 
        h2 { line-height: 1; }
        p {font-size: var(--h5);}
        .icon_container { width: 48px; height: 48px; border-radius: 50%; background: var(--color); display: flex; align-items: center; justify-content: center; 
            i, svg { font-size: 22px; color: #fff; }
        }
    }
    .btn { position: relative; width: 100%; text-align: center; font-size: var(--h4); 
        &:not(.active) { 
            &::after { content: ''; position: absolute; inset: 0; background: #fff; opacity: 0.4;}
        }
    }
    .questions_container { display: flex; flex-direction: column; gap: var(--gap_l);
        --local_padding: 12px;
        .main_text { display: flex; flex-direction: column; gap: var(--gap_small);
            textarea { line-height: 1.2em; height: 4.6em; }
        }
        
    }
}
</style>