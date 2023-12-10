<template>
    <div class="d-lg-flex">
        <div class="white-block w-md-50">
            <div class="pa-12 d-flex justify-center justify-md-start">
                <div class="d-flex flex-column flex-md-row align-center">
                    <VAvatar
                        size="96"
                        image="/sarah.jpg"
                        alt="Sarah"
                    />

                    <span class="brand ml-md-2">
                        Le Jardin de Sarah
                    </span>
                </div>
            </div>
            <div class="px-10 mt-4">
                <slot />
            </div>
        </div>
        <div
            class="d-none d-lg-flex flex-1-1 h-screen overflow-hidden bg-cover"
            style="background-image: url('/garden.jpg');"
        />
    </div>
</template>

<style scoped lang="scss">
.brand {
    color: #3730a3;
    font-size: 1.5rem;
    font-weight: 600;
    letter-spacing: .025em;
    line-height: 2rem;
    margin-left: .5rem;
}
.white-block {
    height: 100vh;
    background-color: white;

    @media (min-width: 1280px) {
        width: 640px;
    }
}
</style>
