import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import FullTextInput from '../FullTextInput.vue'

describe('FullTextInput', () => {
    it('renders properly', () => {
        const wrapper = mount(FullTextInput, { props: { msg: 'Hello Vitest' } })
        expect(wrapper.text()).toContain('Léamh JSON Annotation Generator')
    })
})