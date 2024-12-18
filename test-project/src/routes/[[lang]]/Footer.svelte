<script>
    import { base } from '$app/paths';
    import { t } from '$lib/translations';
    import PeopleProfileList from '$routes/people-profile/components/PeopleProfileList.svelte';
    import IRContactTemplate from '$routes/people-profile/components/templates/PeopleProfileIRContact.svelte';
    import { footerMenu } from '$utils/footerMenu';
    import { footerLinks } from '$utils/footerLinks';
    import MenuFooter from './MenuFooter.svelte';
    const currentYear = new Date().getFullYear();
</script>

<footer class="footer">
   
    <div class="footer__row py-5 footer__bg">
        
        <div class="container">
            <div class="row">
                <div class="col-12 col-sm-6 col-md-8 text-center text-sm-start mb-3 mb-sm-0">
                    <MenuFooter/>
                    <div class="footer__ir-contact">
                        <h4 class="footer__title">IR Contact</h4>
                        <PeopleProfileList
                            categories={['ir_contacts']}
                            itemsPerPage="1"
                            notFound={$t('profile.noItemsFound')}
                            paginatorType={false}
                            template={IRContactTemplate}
                        />
                    </div>
                </div>
                <div class="col-12 col-sm-6 col-md-4 text-center text-sm-end">
                    <div class="footer__social-links">
                        <h4 class="footer__title">Connect With Us</h4>

                        <ul class="text-end">
                            <li class="footer__social-item">
                                <a
                                    href="https://www.facebook.com/EQSGroup/"
                                    class="footer__social-link"
                                >
                                    <i class="footer__social--icon icon-master-facebook-2" />
                                </a>
                            </li>
                            <li class="footer__social-item">
                                <a
                                    href="https://www.instagram.com/eqsgroup/"
                                    class="footer__social-link"
                                >
                                    <i class="footer__social--icon icon-master-instagram-2" />
                                </a>
                            </li>
                            <li class="footer__social-item">
                                <a
                                    href="https://in.linkedin.com/company/eqs-group"
                                    class="footer__social-link"
                                >
                                    <i class="footer__social--icon icon-master-linkedIn-2" />
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="footer__row py-4 text-center secondary-bg">
        <div class="container">
            <div class="row">
                <div class="col-12 col-sm-4 text-center text-sm-start mb-3 mb-sm-0">
                    <div class="footer__logo">
                        <a class="footer__logo-link" href="{base}/">
                            <img
                                class="footer__logo-img"
                                src="https://eqs-prod-2-eu-central-1-mastertemplate.s3.eu-central-1.amazonaws.com/2022/04/master-template.png"
                                alt="Master Template"
                            /></a
                        >
                    </div>
                </div>
                <div class="col-12 col-sm-8 text-center text-sm-end">
                    <div class="footer__menu">
                        <ul class="footer__menu-list">
                            {#each footerMenu as item}
                                <li class="footer__menu-item">
                                    <a class="footer__menu-link" href={item.link}
                                        >{$t('footer.' + item.title)}</a
                                    >
                                </li>
                            {/each}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="footer__row py-2 grey-bg">
        <div class="container">
            <div class="row">
                <div class="col-12 col-sm-5 text-start align-self-center text-center text-sm-start">
                    <div class="footer__copyright">
                        {$t('footer.copyRights', { default: currentYear })}
                    </div>
                </div>
                <div class="col-12 col-sm-7 text-center text-sm-end">
                    <div class="footer__links">
                        <ul class="footer__link-list">
                            {#each footerLinks as item}
                                <li class="footer__link-item">
                                    <a class="footer__link" href={item.link}
                                        >{$t('footer.' + item.title)}</a
                                    >
                                </li>
                            {/each}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</footer>
