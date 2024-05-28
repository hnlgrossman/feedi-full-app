<template>
    <div class="upload_pic_container"  :class="{pic_upload: modelValue}">
        <label for="upload_file" class="pic" :style="'background-image: url(' + getPic(modelValue) + ');'"> <span v-text="text"></span> </label>
        <input type="file" id="upload_file" @change="handleFileUpload">
        <div class="delete" @click.stop="handleDelete" ><i class="fa-solid fa-trash"></i></div>
    </div>
</template>

<script>
export default {
    props: {
        modelValue: String,
        text: String
    },
    data() {
        return {
            selectedFile: null,
            presignedUrl: '',
            selectedFileName: '', // Store the file name
            filename: '',
            fileUrl: '', // Store the file URL
            bucket: 'feedi-file-storge',
            folder: 'questions_images',
            region: 'eu-central-1'
        }
    },
    mounted() {
    },
    methods: {
        async handleDelete() {
            const headers = await {
                Authorization: localStorage.getItem('user_token')
            }

            try {
                this.axios.delete(window.host_url + 'upload_file/delete_file', {
                    headers,
                    data: {
                        fileUrl: this.modelValue
                    }
                });

            } catch (error) {
                console.log(error);
                alert('בעיה בהעלאת תמונה צרו קשר עם מנהל האתר.')
            }   
            this.$emit('update:modelValue', '')
        },
        async getPresignedUrl() {
            const headers = await {
                Authorization: localStorage.getItem('user_token')
            }
            const response = await this.axios.post(window.host_url + 'upload_file/generate-presigned-url', {
                fileType: this.selectedFile.type,
                folder: this.folder,
            }, { headers });
            this.presignedUrl = response.data.url;
            this.filename = response.data.filename;
        },
        async handleFileUpload(event) {
            this.selectedFile = event.target.files[0];
            this.selectedFileName = this.selectedFile.name;
            try {
                if (!this.selectedFile) return;
                await this.getPresignedUrl();
                const options = {
                    headers: {
                        'Content-Type': this.selectedFile.type,
                    },
                };
                const response = await this.axios.put(this.presignedUrl, this.selectedFile, options);
                if (response.status !== 200) {
                    // alert('בעיה בהעלאת תמונה צרו קשר עם מנהל האתר.')
                } else { 
                    this.fileUrl = `https://${this.bucket}.s3.${this.region}.amazonaws.com/${this.folder}/${this.filename}`; // Construct the public URL
                    this.$emit('update:modelValue', this.fileUrl)
                }
            } catch (error) {
                console.log(error);
                alert('בעיה בהעלאת תמונה צרו קשר עם מנהל האתר.')
            }
        },
    }
}
</script>

<style lang="scss">
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
</style>