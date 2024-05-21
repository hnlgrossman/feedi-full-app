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
            <div class="upload_pic_container"  :class="{pic_upload: formData.pic}">
                <label for="upload_file" class="pic" :style="'background-image: url(' + getPic(formData.pic) + ');'"> <span>העלה תמונה לשאלה</span> </label>
                <input type="file" id="upload_file" @change="handleFileUpload">
                <div class="delete" @click.stop="handleDelete" ><i class="fa-solid fa-trash"></i></div>
            </div>
            <input class="btn" type="submit" :value="editQuestion ? 'עדכן שאלה' : 'הוסף שאלה'">
        </form>
        <p class="msg" v-text="msg.text" :style="{color: msg.color}" v-if="msg.text"></p>
    </div>

  </div>
</template>

<script>
export default {
    props: ['active', 'editQuestion'],
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
        handleDelete() {
            this.deleteFiles(this.formData.pic)
            this.formData.pic = '';
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
        async handleFileUpload(event) {
            // console.log("file");
            const file = event.target.files[0];
            // if (!file) return;
            // console.log(this.file);
            const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
            if (!file?.type) return false;
            if (!allowedTypes.includes(file.type)) {
                this.msg.text = "Filetype is wrong!!";
                this.msg.color = "red";
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                this.msg.text = "Too large, max size allowed is 10mb";
                this.msg.color = "red";
                return;
            }
            const formData = new FormData();
            formData.append('file', file);
            try {
                const headers = {
                    Authorization: localStorage.getItem('user_token')
                }
                const data = await this.axios.post(window.host_url + 'upload_file', formData, { headers });
                if (this.formData.pic) {
                    // this.filesToDelete.push(this.formData.pic)
                    this.deleteFiles(this.formData.pic)
                }
                // console.log(data);
                this.formData.pic = data.data.filename

                
                // alert('Image uploaded successfully!');
            } catch (error) {
                console.log(error);
                alert('בעיה בהעלאת תמונה צרו קשר עם מנהל האתר.')
            }
        },
        async deleteFiles(filename) {
            const headers = await {
                Authorization: localStorage.getItem('user_token')
            }
            // console.log(this.filesToDelete);
            return await this.axios.delete(window.host_url + 'upload_file', {
                data: { filesToDelete: filename },
                headers: headers
            });
        }
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

            .upload_pic_container { position: relative; background: #EAEAEA; border: 5px dashed var(--color); width: 90%; margin: 0 auto; aspect-ratio: 16 / 9; 
                &.pic_upload { border: none;
                    span { display: none;}
                    label { pointer-events: none; }
                    .delete { position: absolute; top: 5px; left: 5px; display: flex; width: 38px; height: 38px; border-radius: 50%; background: #EAEAEA; align-items: center; justify-content: center;
                        i, svg { color: var(--color); font-size: 18px }
                    }
                }
                .delete { display: none;}
                label { font-size: var(--h4); color: var(--color); text-align: center;  display: flex; justify-content: center; align-items: center; width: 100%; height: 100%;}
                #upload_file {opacity: 0; z-index: -1; width: 0; }
            }
        }
        .msg { color: var(--color); text-align: center; font-weight: bold; font-size: var(--h4);}
    }
}
</style>