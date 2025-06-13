<script lang="ts">
/*
    - XMB holds XMB Columns
    - XMB Columns holds XMB Panels

    - Panels are passed to columns in the Column slot
    - A list is passed to the column containing all of the visibility refs
    - On column up/down arrow or w/s key:
        - make the current panel invisible and the next one visible
    - Also need to pass the starting one? or maybe have the Column user set them as desired
    
    - transitions controlled by vue CSS-based-transitions
    - Probably goind to need some type of cooldown on the switching of pages

    - Columns are passed to XMB in slot
    - Basically do the same thing as with panels except left/right
*/
</script>

<template>
    <div class="h-full w-full flex">
        <slot />
    </div>
</template>