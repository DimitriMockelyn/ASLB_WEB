import keys from 'lodash/object/keys';
import trim from 'lodash/string/trim';

export default {

    /**
     * Transform an objet to an array.
     * @param  {object} data object to transform
     * @param  {string} key  property key to transform
     */
      _transformSearchResponseObjectToArray(data, key) {
        const obj = data[key];
        data[key] = keys(obj).reduce((arr, keyArray) => {
            const arrObj = {};
            arrObj[keyArray] = obj[keyArray];
            arr.push(arrObj);
            return arr;
        }, []);
    },

    _transformSearchResponseArrayToObject(data, key) {
      const obj = data[key];
      const retour = {};
      obj.forEach(value => {
          retour[keys(value)[0]] = value[keys(value)[0]];
      });
      data[key] = retour;
  },

    /**
     * Transform an old search response
     * @param  {object} data search response to transform
     * @return {object}      transform repsonse object
     */
    transformResponse(data) {
        if(data.groups){
            this._transformSearchResponseArrayToObject(data, 'groups');
        }
        if(data.facets) {
            this._transformSearchResponseArrayToObject(data, 'facets');
            keys(data.facets).forEach(key => {
                return this._transformSearchResponseArrayToObject(data.facets, key);
            });
        }
        return data;
    },
    sortKeysFacetNames(a,b) {
        if (+keys(a)[0] < +keys(b)[0]) {
            return -1;
        }
        if (+keys(a)[0] > +keys(b)[0]) {
            return 1;
        }
        return 0;
    },
    sortKeysFacetValues(a,b) {
        if (a[keys(a)[0]] < b[keys(b)[0]]) {
            return -1;
        }
        if (a[keys(a)[0]] > b[keys(b)[0]]) {
            return 1;
        }
        return 0;
    },
    sortFacets(data) {
        const keysFacets = [];
        for (const index in data.facets) {
            if (data.facets.hasOwnProperty(index)) {
                const keyTranslate = i18n.t('live.filter.facets.' + keys(data.facets[index])[0]);
                const obj = {};
                obj[keyTranslate] = data.facets[index];
                keysFacets.push(obj);
            }
        }
        keysFacets.sort(function(a,b) {
            if (keys(a)[0] < keys(b)[0]) {
                return -1;
            }
            if (keys(a)[0] > keys(b)[0]) {
                return 1;
            }
            return 0;
        });
        for (const index in data.facets) {
            if (data.facets.hasOwnProperty(index)) {
                const facetOrdered = keysFacets[index][keys(keysFacets[index])[0]];
                const arrayRes = facetOrdered[keys(facetOrdered)[0]];
                if (keys(facetOrdered)[0] === 'FCT_OF_ANNEE_DECLARATION') {
                    arrayRes.sort(this.sortKeysFacetNames);
                } else {
                    arrayRes.sort(this.sortKeysFacetValues);
                }
                facetOrdered[keys(facetOrdered)[0]] = arrayRes;
                data.facets[index] = facetOrdered;
            }
        }
        return data;
    },

    /**
     * Transform the configuration send to server to fit new search api contract
     * @param  {object} config          search configuration that will be sent to the server
     * @param  {boolean} includeFacets  indicates whether the facets should be included in the configuration or not
     * @return {object}                 the configuration that fits to new search api contract
     */
     transformConfig(config, includeFacets = true) {
        const {data} = config;
        const {facets, group} = data;
        const trimmedGroup = trim(group);
        if(includeFacets) {
            config.data['facets'] = facets;
        }
        if (! ('FCT_OF_ANNEE_EXERCICE' in config.data['facets'])) {
            delete config.data['facets']['FCT_OF_ETAT_BPF_N'];
            delete config.data['facets']['FCT_OF_ETAT_BPF_N_1'];
            delete config.data['facets']['FCT_OF_ETAT_BPF_N_2'];
            delete config.data['facets']['FCT_OF_ETAT_BPF_N_3'];
            delete config.data['facets']['FCT_OF_NEANT_BPF_N'];
            delete config.data['facets']['FCT_OF_NEANT_BPF_N_1'];
            delete config.data['facets']['FCT_OF_NEANT_BPF_N_2'];
            delete config.data['facets']['FCT_OF_NEANT_BPF_N_3'];
        }
        if(trimmedGroup.length > 0) {
            config.data['group'] = trimmedGroup;
        }
        return config;
    }

};
