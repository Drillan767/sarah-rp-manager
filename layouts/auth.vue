<template>
    <div class="d-lg-flex">
        <div class="white-block">
            <div class="branding">
                <img
                    class="rounded-full h-24 w-24"
                    src="/sarah.jpg"
                    alt="Sarah"
                >

                <span>
                    Le Jardin de Sarah
                </span>
            </div>
            <div class="px-12 sm:px-24 md:px-48 lg:px-12 xl:px-24 xl:max-w-2xl">
                <slot />
            </div>
        </div>
        <div
            class="hidden d-lg-flex flex-1-1 h-screen overflow-hidden bg-cover"
            style="background-image: url('https://images7.alphacoders.com/689/689877.jpg');"
        />
    </div>
</template>

<style scoped lang="scss">
.white-block {
    width: 50%;
    height: 100vh;
    background-color: white;

    @media (min-width: 1280px) {
        width: 640px;
    }

    .branding {
        display: flex;
        align-items: center;
        justify-content: center;
        padding-bottom: 3rem;
        padding-top: 3rem;

        @media (min-width: 1024px) {
            justify-content: start;
            padding-left: 3rem;
            padding-right: 3rem;
        }

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
