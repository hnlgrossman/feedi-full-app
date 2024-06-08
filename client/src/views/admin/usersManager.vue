<template>
    <addUserPopup @addUser="addUser" @updateUser="updateUser" :editUser="editUser" :active="addUserPopupOpen" @close="handleClose"/>
  <div id="users_manager">
    <div class="head">
        <h1>משתמשים</h1>
        <div class="icon_container" @click="addUserPopupOpen = true">
            <i class="fas fa-plus"></i>
        </div>
    </div>
    <ul class="users_container">
        <li @click="editUser = userItem; addUserPopupOpen = true" class="user" v-for="userItem in users" :key="userItem._id" >
            <div class="actions">
                <div class="delete" @click.stop="handleDelete(userItem._id)" ><i class="fa-solid fa-trash"></i></div>
            </div>
            <div class="text" v-text="userItem.name"></div>
            <router-link @click.stop="" :to="{ name: 'review', params:{user_id: userItem._id}}" v-bind="{ target: '_blank'}" >לדף שאלות</router-link>
            <a @click.stop="loginAs(userItem)" >התחבר כיוזר</a>
            <!-- <div class="pic" :style="'background-image: url(' + getPic(question.pic) + ');'"></div> -->
        </li>
    </ul>
  </div>
</template>

<script>
import addUserPopup from '@/components/admin/addUserPopup.vue'

export default {
    props: ['user'],
    components: {addUserPopup},
    data() {
        return {
            editUser: null,
            addUserPopupOpen: false,
            users: []
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            this.api({ action: 'user/users', data: {...this.formData}, method: 'get'}, 
                (data) => {
                    if (data) {
                        this.users = data;
                    }
                }, (error) => {
                    console.error(error.data, 'hnl');
                }
            )
        },
        
        handleClose() {
            // this.addUserPopupOpen = false;
            this.addUserPopupOpen=false; 
                // if (this.editUser) {
                    this.editUser = null;

        },
        handleDelete(id) {
            this.api({ action: 'user/' + id, data: {}, method: 'delete'}, 
                (data) => {
                    if (data) {
                        this.users = this.users.filter(item => item._id != id);
                    }
                }, (error) => {
                    console.error(error.data, 'hnl');
                }
            )
        },
        addUser() {
            this.handleClose()
            
            // setTimeout(() => { this.addUserPopupOpen=false; }, 700)
            this.init()
        },
        updateUser() {
            // setTimeout(() => { this.addUserPopupOpen=false; }, 700)
            // this.editUser = false;
            this.handleClose()
            this.init();
        },
        loginAs (login_user){
            this.api({action: 'user/login_as', data: {user_id: login_user?._id}, method: 'post'},
            (data) => {
                if (data) {
                    localStorage.setItem('user_token', data);
                    this.$router.push({ name: 'edit_form'}).then(() => { this.$router.go(0) })
                    // this.$router.push({ name: 'edit_form'})
                }
            }, (error) => {
                console.error(error.data);
            })
        }
    }

}
</script>

<style lang="scss">
#users_manager { padding-block: 30px; padding-inline: var(--padding_inline); display: flex; flex-direction: column; gap: var(--gap_l); min-height: calc(100vh - var(--headerHeight));
    .head { display: flex; justify-content: space-between; 
        .icon_container { width: 48px; height: 48px; border-radius: 50%; background: var(--color); display: flex; align-items: center; justify-content: center; 
            i, svg { font-size: 22px; color: #fff; }
        }
    }
    .users_container { display: flex; flex-direction: column; gap: var(--gap);
        --local_padding: 12px;
        li { display: flex; gap: var(--gap_small); padding: var(--local_padding); border-radius: var(--radius_small); background: var(--color);
            .text { flex: 2; color: #000;}
            .pic {flex: 1; aspect-ratio: 16 / 9; border-radius: calc(var(--radius_small) - (var(--local_padding) / 2));}
            .delete { display: flex; width: 28px; height: 28px; border-radius: 50%; background: #EAEAEA; align-items: center; justify-content: center;
                i, svg { color: var(--color); font-size: 16px }
            }
            a {  color: #000;}
        }
    }
}
</style>