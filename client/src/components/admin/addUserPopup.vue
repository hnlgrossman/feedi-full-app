<template>
<div id="add_user_popup" :class="{active: active}">
    <div class="content">
        <div class="head">
            <h2>הוספת משתמש</h2>
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
        <form @submit.prevent="editUser ? updateUser() : addUser()">
            <ul>
                <li>
                    <input type="text" v-model="formData.name" name="name" placeholder="שם">
                </li>
                <li>
                    <input type="text" v-model="formData.business_name" name="business_name" placeholder="שם העסק" required>
                </li>
                <li>
                    <input type="text" v-model="formData.google_review_link" name="google_review_link" placeholder="לינק לדירוג" required>
                </li>
                <li>
                    <input type="email" v-model="formData.email" name="email" placeholder="מייל" required>
                </li>
                <li>
                    <input type="text" v-model="formData.phone" name="phone" placeholder="פאלפון">
                </li>
                <li>
                    <input type="password" v-model="formData.password" name="password" placeholder="סיסמא" :required="!editUser">
                </li>
                <li>
                    <select required name="user_type" v-model="formData.userType">
                        <option value="">בחר סוג משתמש</option>
                        <option value="business">עסק</option>
                        <option value="admin">מנהל</option>
                    </select>
                </li>
            </ul>
            <input class="btn" type="submit" :value="editUser ? 'עדכן משתמש' : 'הוסף משתמש'">
        </form>
        <p class="msg" v-text="msg.text" :style="{color: msg.color}" v-if="msg.text"></p>
    </div>

</div>
</template>

<script>
export default {
    props: ['active', 'editUser'],
    data() {
        return {
            filesToDelete: [ ],
            formData: {
                name: '',
                business_name: '',
                google_review_link: '',
                email: '',
                phone: '',
                password: '',
                userType: ''
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
            return true;
            // if (!this.formData.text ) {
            //     this.msg.text = "טקסט חובה";
            //     this.msg.color = "red";
            //     return;
            //     // isValidate = false
            // }
            // if (!this.formData.pic ) {
            //     this.msg.text = "תמונה חובה";
            //     this.msg.color = "red";
            //     return;
            // }
            // return true;
            // retue
        },
        addUser() {
            if (!this.validate()) return false;
            this.api({ action: 'user/signup', data: {...this.formData}, method: 'post'}, 
            (data) => {
                if (data) {
                    this.msg = { text: 'משתמש נוסף בהצלחה', color: 'var(--color)'}
                    this.$emit('addUser', data);
                    // this.close()
                    
                }
            }, (error) => {
                alert(error.data)
                // if (error.data === "this user already registered.") {
                //     alert("")
                // } else {
                //     alert()
                // }
                console.error(error.data, 'hnl');
            })
        },
        updateUser() {
            if (!this.validate()) return false;
            if (this.formData.password === '') {
                delete this.formData.password
            }
            this.api({ action: 'user/update_user?user_id=' + this.editUser._id, data: { ... this.formData }, method: 'put'}, 
                (data) => {
                    if (data) {
                        this.msg = { text: 'משתמש עודכן בהצלחה', color: 'var(--color)'}
                        this.$emit('updateUser', data);
                        // this.close()
                        // this.formData = {
                        //     text: '',
                        //     pic: ''
                        // }
                    }
                }, (error) => {
                    console.error(error.data, 'hnl');
                }
            )
        },
        
    },
    watch: {
        editUser() {
            if (this.editUser) {
                this.formData = this.editUser;
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
#add_user_popup { transition: 0.3s all; position: fixed; inset: 0; z-index: 10;
    // &::after { content: ''; pointer-events: none; position: absolute; inset: 0; background: rgba(55, 55, 55, 0.3);}
    
    &:not(.active) {  background: rgba(55, 55, 55, 0); pointer-events: none; }
    &.active { background: rgba(55, 55, 55, 0.3); 
        .content {  top: 50%; }
    }
    .content { transition: 0.3s all; position: absolute; top: -100%; right: 50%; width: 90%; transform: translate(50%, -50%); display: flex; flex-direction: column; gap: var(--gap_l); background: #fff; border-radius: var(--radius); padding: var(--padding_inline);

        .head { display: flex; align-items: center; justify-content: space-between; 
            .close { font-size: 22px;}
        }
        form { display: flex; flex-direction: column; gap: var(--gap_l);
            ul { display: flex; flex-direction: column; gap: var(--gap);
                li {}
            }
            select, input[type=text], input[type=email], input[type=password] { background: #EAEAEA; }
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