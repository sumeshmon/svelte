<script>
    import Menu from './Menu.svelte';
    import Search from '$components/Header/Search.svelte';
    import Navbar from '$components/Header/Navbar.svelte';
    import LanguageSelector from '$components/Header/LanguageSelector.svelte';
    import PriceTicker from './share/components/PriceTicker.svelte';
</script>

<header class="header">
    <div class="header__top-bar">
        <div
            class="container d-flex justify-content-end justify-content-sm-between h-100 align-items-center"
        >
            <div class="d-none d-sm-block">
                <PriceTicker chartSlug="template-v31" />
            </div>
            <div class="d-flex h-100">
                <Search />
                <LanguageSelector />
            </div>
        </div>
    </div>

    <Navbar>
        <Menu />
    </Navbar>
</header>
