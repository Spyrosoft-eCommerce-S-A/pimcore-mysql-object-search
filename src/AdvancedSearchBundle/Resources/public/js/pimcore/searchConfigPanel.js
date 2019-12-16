pimcore.registerNS("pimcore.bundle.advancedSearch.searchConfigPanel");

pimcore.bundle.advancedSearch.searchConfigPanel = Class.create(pimcore.element.abstract, {
    initialize: function (data) {
        this.id = uniqid();
        this.data = data;
        if (!this.data) {
            this.data = {};
        }

        this.tab = new Ext.TabPanel({
            activeTab: 0,
            id: this.getTabId(),
            iconCls: "pimcore_bundle_advancedSearch",
            closable: true,
            forceLayout: true,
            items: [this.getConditions(), this.getResults(), this.getSaveAndShare()]
        });

        this.setTitle();

        this.tab.on("activate", this.tabactivated.bind(this));

        var tabPanel = Ext.getCmp("pimcore_panel_tabs");
        tabPanel.add(this.tab);
        tabPanel.setActiveItem(this.getTabId());

        // open result panel for saved searches
        if (this.data.classId && data.conditions && data.conditions.filters) {
            //this.tab.setActiveItem(this.resultPanel.getLayout(data));
        }

        this.tab.on("destroy", function () {
            pimcore.globalmanager.remove(this.getTabId());
        }.bind(this));

        pimcore.layout.refresh();
    },

    getTabId: function () {
        return this.tabId = "pimcore_search_" + this.id;
    },

    activate: function () {
        var tabPanel = Ext.getCmp("pimcore_panel_tabs");
        tabPanel.setActiveItem(this.getTabId());
    },

    tabactivated: function () {
        setTimeout(function () {
            this.checkForChanges();
        }.bind(this), 8000);
    },

    getConditions: function () {
        this.conditionPanelContainer = Ext.create('Ext.panel.Panel', {});

        var classStore = pimcore.globalmanager.get("object_types_store");

        this.classSelection = Ext.create('Ext.form.ComboBox',
            {
                fieldLabel: t("class"),
                store: classStore,
                valueField: 'id',
                displayField: 'translatedText',
                triggerAction: 'all',
                value: this.data.classId,
                queryMode: 'local',
                width: 300,
                forceSelection: true,
                listeners: {
                    change: function (item, newValue, oldValue, eOpts) {
                        if (newValue != oldValue) {
                            this.conditionPanelContainer.removeAll();
                            this.conditionPanel = new pimcore.bundle.advancedSearch.searchConfig.conditionPanel(newValue);
                            this.conditionPanelContainer.add(this.conditionPanel.getConditionPanel());
                        }
                    }.bind(this)
                }
            }
        );

        if (this.data.classId) {
            this.conditionPanel = new pimcore.bundle.advancedSearch.searchConfig.conditionPanel(this.data.classId, this.data.conditions);
            this.conditionPanelContainer.add(this.conditionPanel.getConditionPanel());
        }

        return new Ext.Panel({
            scrollable: true,
            style: "padding: 10px",
            labelWidth: 400,
            title: t("bundle_advancedSearch_filter"),
            iconCls: "pimcore_bundle_advancedSearch_filter",
            items: [this.classSelection, this.conditionPanelContainer]
        });
    },

    getResults: function() {
        this.resultPanel = new pimcore.bundle.advancedSearch.searchConfig.resultPanel(this.getSaveData.bind(this), this.data.gridConfig);
        return this.resultPanel.getLayout();
    },


    getSaveAndShare: function () {

        this.store = new Ext.data.JsonStore({
            autoDestroy: true,
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: '/admin/bundle/advanced-search/admin/get-users',
                reader: {
                    rootProperty: 'data',
                    idProperty: 'id'
                }
            },
            fields: ['id','label']
        });

        this.nameField = Ext.create('Ext.form.field.Text', {
            fieldLabel: t("name"),
            name: "name",
            width: 500,
            value: this.data.settings ? this.data.settings.name : ""
        });

        this.sharingField = Ext.create('Ext.form.field.Tag', {
            name: "shared_users",
            width: 500,
            fieldLabel: t("bundle_advancedSearch_users"),
            queryDelay: 0,
            resizable: true,
            queryMode: 'local',
            minChars: 1,
            store: this.store,
            displayField: 'label',
            valueField: 'id',
            forceSelection: true,
            filterPickList: true,
            value: this.data.settings ? this.data.settings.sharedUserIds : ""
        });


        var buttons = [];


        var buttonText = t("bundle_advancedSearch_add_to_shortcuts");
        if(this.data.settings && this.data.settings.hasShortCut) {
            buttonText = t("bundle_advancedSearch_remove_from_shortcuts");
        }

        this.toggleShortCutButton = Ext.create('Ext.button.Button', {
            text: buttonText,
            // iconCls: "pimcore_icon_delete",
            handler: this.toggleShortCut.bind(this)
        });

        buttons.push(this.toggleShortCutButton);


        if(!this.data.settings || this.data.settings.isOwner) {
            buttons.push({
                text: t("delete"),
                iconCls: "pimcore_icon_delete",
                handler: this.delete.bind(this)
            });
            buttons.push({
                text: t("save"),
                iconCls: "pimcore_icon_apply",
                handler: this.save.bind(this)
            });
        } else if(!this.data.settings.isOwner) {
            buttons.push({
                text: t("bundle_advancedSearch_save_as_copy"),
                iconCls: "pimcore_icon_apply",
                handler: this.saveAsCopy.bind(this)
            });
        }

        this.settingsForm = Ext.create('Ext.form.FormPanel', {
            title: t("bundle_advancedSearch_save_and_share"),
            iconCls: "pimcore_bundle_advancedSearch_saveAndShare",
            bodyStyle: "padding:10px;",
            autoScroll: true,
            border:false,
            items: [
                this.nameField, {
                    name: "description",
                    fieldLabel: t("description"),
                    xtype: "textarea",
                    width: 500,
                    height: 100,
                    value: this.data.settings ? this.data.settings.description : ""
                }, {
                    xtype: "textfield",
                    fieldLabel: t("bundle_advancedSearch_category"),
                    name: "category",
                    width: 500,
                    value: this.data.settings ? this.data.settings.category: ""
                }, {
                    xtype: "fieldset",
                    title: t("bundle_advancedSearch_share"),
                    closeable: true,
                    items: [
                        this.sharingField
                    ]
                }],
            buttons: buttons
        });

        return this.settingsForm;
    },

    getSaveData: function(raw) {
        var saveData = {};

        saveData['classId'] = this.classSelection.getValue();

        if(this.conditionPanel) {
            saveData["conditions"] = this.conditionPanel.getSaveData();
        }
        if(this.resultPanel) {
            saveData["gridConfig"] = this.resultPanel.getSaveData();
            saveData["gridConfig"]['sortinfo'] = null;
        }

        if(this.settingsForm) {
            saveData["settings"] = this.settingsForm.getForm().getFieldValues();
        }

        if(raw) {
            return saveData;
        } else {
            return Ext.encode(saveData);
        }
    },

    save: function () {
        var saveData = this.getSaveData();

        //remote to update id in global manager later on
        pimcore.globalmanager.remove(this.getTabId());

        Ext.Ajax.request({
            url: '/admin/bundle/advanced-search/admin/save',
            params: {
                id: this.data ? this.data.id : null,
                data: saveData
            },
            method: "post",
            success: function (response) {
                var rdata = Ext.decode(response.responseText);
                if (rdata && rdata.success) {
                    pimcore.helpers.showNotification(t("success"), t("bundle_advancedSearch_save_success"), "success");

                    if(!this.data) {
                        this.data = {};
                    }
                    this.data.id = rdata.id;

                    //to update id in global manager
                    this.tabId = null;
                    pimcore.globalmanager.add(this.getTabId(), this);

                    this.setTitle(this.nameField.getValue());

                    this.resetChanges();
                }
                else {
                    pimcore.helpers.showNotification(t("error"), t("bundle_advancedSearch_save_error"), "error",t(rdata.message));
                }
            }.bind(this)
        });

    },

    saveAsCopy: function () {
        this.data.id = null;
        this.sharingField.setValue("");
        this.nameField.setValue(this.nameField.getValue() + " " + t("bundle_advancedSearch_name_copy_suffix"));

        var saveData = this.getSaveData();

        Ext.Ajax.request({
            url: "/admin/bundle/advanced-search/admin/save",
            params: {
                id: this.data ? this.data.id : null,
                data: saveData
            },
            method: "post",
            success: function (response) {
                var rdata = Ext.decode(response.responseText);
                if (rdata && rdata.success) {
                    pimcore.helpers.showNotification(t("success"), t("bundle_advancedSearch_save_success"), "success");

                    this.tab.close();

                    Ext.Ajax.request({
                        url: "/admin/bundle/advanced-search/admin/load-search",
                        params: {
                            id: rdata.id
                        },
                        method: "get",
                        success: function (response) {
                            var rdata = Ext.decode(response.responseText);
                            var esSearch = new pimcore.bundle.advancedSearch.searchConfigPanel(rdata);
                            pimcore.globalmanager.add(esSearch.getTabId(), esSearch);
                        }.bind(this)
                    });
                }
                else {
                    pimcore.helpers.showNotification(t("error"), t("bundle_advancedSearch_save_error"), "error",t(rdata.message));
                }
            }.bind(this)
        });
    },

    delete: function() {
        if(!this.data && !this.data.id) {
            pimcore.helpers.showNotification(t("error"), t("bundle_advancedSearch_delete_error"), "error");
        } else {
            Ext.MessageBox.show({
                title:t('delete'),
                msg: t("bundle_advancedSearch_delete_really"),
                buttons: Ext.Msg.OKCANCEL ,
                icon: Ext.MessageBox.INFO ,
                fn: function(button) {
                    if (button == "ok") {
                        Ext.Ajax.request({
                            url: "/admin/bundle/advanced-search/admin/delete",
                            params: {
                                id: this.data.id
                            },
                            method: "post",
                            success: function (response) {
                                pimcore.globalmanager.remove(this.getTabId());
                                pimcore.bundle.advancedSearch.helper.rebuildAdvancedSearchMenu();
                                this.tab.close();
                            }.bind(this)
                        });
                    }


                }.bind(this)
            });
        }
    },

    toggleShortCut: function() {
        if(!this.data && !this.data.id) {
            pimcore.helpers.showNotification(t("error"), t("bundle_advancedSearch_short_cut_error"), "error");
        } else {
            Ext.Ajax.request({
                url: "/admin/bundle/advanced-search/admin/toggle-short-cut",
                params: {
                    id: this.data.id
                },
                method: "post",
                success: function (response) {
                    var rdata = Ext.decode(response.responseText);
                    if(rdata.success) {
                        if(rdata.hasShortCut) {
                            this.toggleShortCutButton.setText(t("bundle_advancedSearch_remove_from_shortcuts"));
                        } else {
                            this.toggleShortCutButton.setText(t("bundle_advancedSearch_add_to_shortcuts"));
                        }
                        pimcore.bundle.advancedSearch.helper.rebuildAdvancedSearchMenu();
                    }




                }.bind(this)
            });

        }
    },

    setTitle: function (name) {
        var title = t("bundle_advancedSearch");
        if (name) {
            title = title + ": " + name;
        } else if (this.data.settings && this.data.settings.name) {
            title = title + ": " + this.data.settings.name;
        }
        this.tab.setTitle(title);
        this.tab.initialConfig = {
            title: title
        };
    }
});
