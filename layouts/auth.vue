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

    .branding {
        /* display: flex;
        align-items: center;
        justify-content: center;
        padding-bottom: 3rem;
        padding-top: 3rem;

        @media (min-width: 1024px) {
            justify-content: start;
            padding-left: 3rem;
            padding-right: 3rem;
        } */

        img {
            border-radius: 50%;
            width: 6rem;
            height: 6rem;
        }

        span {
            color: rgb(55 48 163);
            letter-spacing: .025em;
            font-weight: 600;
            font-size: 1.5rem;
            line-height: 2rem;
            margin-left: 0.5rem;
        }
    }
}
</style>
