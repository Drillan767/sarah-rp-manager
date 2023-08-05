<template>
    <div class="lg:flex">
        <div class="lg:w-1/2 xl:max-w-screen-sm min-h-screen bg-white ">
            <div class="py-12 bg-indigo-100 lg:bg-white flex justify-center lg:justify-start lg:px-12">
                <div class="cursor-pointer flex items-center">
                    <img
                        class="rounded-full h-24 w-24"
                        src="/sarah.jpg"
                    >

                    <div class="text-2xl text-indigo-800 tracking-wide ml-2 font-semibold">
                        Le Jardin de Sarah
                    </div>
                </div>
            </div>
            <div class="px-12 sm:px-24 md:px-48 lg:px-12 xl:px-24 xl:max-w-2xl">
                <slot />
            </div>
        </div>
        <div
            class="hidden lg:flex flex-1 h-screen overflow-hidden bg-cover"
            style="background-image: url('https://images7.alphacoders.com/689/689877.jpg');"
        />
    </div>
</template>
