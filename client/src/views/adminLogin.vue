<template>
  <div id="admin_login">
    <div class="user_icon_container">
        <div class="icon user_icon"></div>
    </div>
    <form @submit.prevent="login">
        <ul>
            <li class="label_input_transition" :class="{ active: formData.email}">
                <input v-model="formData.email" type="email" name="email" id="email">
                <label for="email">אימייל</label>
            </li>
            <li class="label_input_transition" :class="{ active: formData.password}">
                <input v-model="formData.password" type="password" name="password" id="password">
                <label for="password">סיסמא</label>
            </li>
        </ul>
        <input type="submit" class="btn big" value="כניסה">
    </form>
  </div>
</template>

<script>

export default {
    props: ['user'],
    data() {
        return {
            formData: {
                email: '',
                password: ''
            }
        }
    },
    mounted() {
        
        if (this.user) {
            this.$router.push({ name: 'admin'})
        }
    },
    methods: {
        login() {
            this.api({ action: 'user/login', data: {...this.formData}, method: 'post'}, 
            (data) => {
                if (data) {
                    localStorage.setItem('user_token', data);
                    this.$router.push({ name: 'admin'}).then(() => { this.$router.go(0) })
                    // window.location.reload()
                }
            }, (error) => {
                // console.log(error);
                if (error.data === "invalid email or password.") {
                    alert('אימייל או סיסמא לא נכונים');
                    // this.formData = { email: '', password: '' }
                    return;
                }
            })
        }
    }
}
</script>

<style lang="scss">
#admin_login {     z-index: 9; position: relative; min-height: 100vh; display: flex; flex-direction: column; gap: var(--gap_xl); padding-top: var(--gap_xxl); padding-inline: var(--padding_inline); background: var(--color);
    .user_icon_container { margin-inline: auto; width: 32%; aspect-ratio: 1; padding: 32px; border-radius: 50%; background: #fff;
        .icon { width: 100%; height: 100%; }
    }
    form { display: flex; flex-direction: column; gap: var(--gap_xxl);
        ul { display: flex; flex-direction: column; gap: var(--gap_l);
            li {  
                label { font-weight: bold;}
            }
        }
        input[type=submit] { background: #fff; align-self: center; }
    }

}
</style>