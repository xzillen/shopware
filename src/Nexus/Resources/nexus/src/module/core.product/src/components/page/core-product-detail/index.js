import utils from 'src/core/service/util.service';
import template from './core-product-detail.html.twig';
import './core-product-detail.less';

export default Shopware.ComponentFactory.register('core-product-detail', {
    inject: ['productService', 'categoryService', 'productManufacturerService', 'taxService'],

    data() {
        return {
            isWorking: false,
            product: {
                manufacturer: {},
                attribute: {},
                mainDetail: {},
                categories: [],
                extensions: {
                    nexus: {
                        voteAverage: 10.5,
                        listingPrice: 1.50
                    }
                }
            },
            taxRates: [],
            manufacturers: [],
            notModifiedProduct: {}
        };
    },

    computed: {
        categoryService() {
            return this.categoryService;
        }
    },

    created() {
        this.getData();
    },

    watch: {
        $route: 'getData'
    },

    methods: {
        getData() {
            this.getProductData();
            this.getManufacturerData();
            this.getTaxData();
        },

        getProductData() {
            const uuid = this.$route.params.uuid;

            this.isWorking = true;
            this.productService.readByUuid(uuid).then((response) => {
                this.notModifiedProduct = { ...response.data };
                this.product = response.data;
                this.isWorking = false;
            });
        },

        getManufacturerData() {
            this.productManufacturerService.readAll().then((response) => {
                this.manufacturers = response.data;
            });
        },

        getTaxData() {
            this.taxService.readAll().then((response) => {
                this.taxRates = response.data;
            });
        },

        onSaveForm() {
            const uuid = this.$route.params.uuid;
            const changeSet = utils.compareObjects(this.notModifiedProduct, this.product);

            // Check if we're having categories and apply them to the change set
            if (this.product.categories.length) {
                changeSet.categories = this.product.categories;
            }

            console.log(changeSet);
            this.isWorking = true;
            this.productService.updateByUuid(uuid, changeSet).then((response) => {
                this.notModifiedProduct = { ...response.data };
                this.product = response.data;
                this.isWorking = false;
            });
        }
    },

    template
});
