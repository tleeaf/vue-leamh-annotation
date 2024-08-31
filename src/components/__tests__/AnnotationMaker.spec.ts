import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import AnnotationMaker from '../AnnotationMaker.vue'

describe('AnnotationMaker', () => {
    it('renders properly', () => {
        const wrapper = mount(AnnotationMaker, { props: { msg: 'Hello Vitest' } })
        expect(wrapper.text()).toContain('Annotation Maker')
    })
})