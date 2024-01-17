<script lang="ts" setup>
//关注
definePageMeta({
  key: route => route.fullPath
})
</script>

<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm row items-start">
      <q-uploader
          batch
          label="Batch upload"
          multiple
          style="max-width: 300px"
          url="http://localhost:4444/upload"
      />
    </div>
  </div>
  <div class="q-pa-md" style="max-width: 350px">
    <q-list bordered padding>
      <q-item>
        <q-item-section>
          <q-item-label overline>OVERLINE</q-item-label>
          <q-item-label>Single line item</q-item-label>
          <q-item-label caption>Secondary line text. Lorem ipsum dolor sit amet, consectetur adipiscit elit.
          </q-item-label>
        </q-item-section>

        <q-item-section side top>
          <q-item-label caption>5 min ago</q-item-label>
        </q-item-section>
      </q-item>

      <q-separator spaced/>
      <q-item-label header>List Header</q-item-label>

      <q-item>
        <q-item-section avatar>
          <q-icon color="primary" name="bluetooth"/>
        </q-item-section>
        <q-item-section>List item</q-item-section>
        <q-item-section side>
          <q-item-label caption>meta</q-item-label>
        </q-item-section>
      </q-item>

      <q-separator inset="item" spaced/>

      <q-item>
        <q-item-section avatar top>
          <q-avatar color="primary" icon="bluetooth" text-color="white"/>
        </q-item-section>

        <q-item-section>
          <q-item-label>Single line item</q-item-label>
          <q-item-label caption lines="2">Secondary line text. Lorem ipsum dolor sit amet, consectetur adipiscit elit.
          </q-item-label>
        </q-item-section>

        <q-item-section side top>
          <q-item-label caption>5 min ago</q-item-label>
          <q-icon color="yellow" name="star"/>
        </q-item-section>
      </q-item>

      <q-separator inset="item" spaced/>

      <q-item>
        <q-item-section avatar top>
          <q-avatar color="primary" icon="bluetooth" square text-color="white"/>
        </q-item-section>

        <q-item-section>
          <q-item-label>Single line item</q-item-label>
          <q-item-label caption>Secondary line text. Lorem ipsum dolor sit amet, consectetur adipiscit elit.
          </q-item-label>
        </q-item-section>

        <q-item-section side top>
          <q-item-label caption>meta</q-item-label>
        </q-item-section>
      </q-item>

      <q-separator inset="item" spaced/>

      <q-item>
        <q-item-section avatar top>
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>Single line item</q-item-label>
          <q-item-label caption>Secondary line text. Lorem ipsum dolor sit amet, consectetur adipiscit elit.
          </q-item-label>
        </q-item-section>

        <q-item-section side top>
          <q-badge label="10k"/>
        </q-item-section>
      </q-item>

      <q-separator inset="item" spaced/>

      <q-item>
        <q-item-section avatar top>
          <q-avatar rounded>
            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>Single line item</q-item-label>
          <q-item-label caption>Secondary line text. Lorem ipsum dolor sit amet, consectetur adipiscit elit.
          </q-item-label>
        </q-item-section>

        <q-item-section side top>
          <q-item-label caption>meta</q-item-label>
        </q-item-section>
      </q-item>

      <q-separator spaced/>

      <q-item>
        <q-item-section class="q-ml-none" thumbnail top>
          <img src="https://cdn.quasar.dev/img/mountains.jpg">
        </q-item-section>

        <q-item-section>
          <q-item-label>Single line item</q-item-label>
          <q-item-label caption>Secondary line text. Lorem ipsum dolor sit amet, consectetur adipiscit elit.
          </q-item-label>
        </q-item-section>

        <q-item-section side top>
          <q-item-label caption>meta</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<style scoped>

</style>