import React from 'react'
import { Box, Flex, HStack, Link as ChakraLink } from '@chakra-ui/react'
import { navLinks } from './content'
import { navStyles } from '../../styles/homeStyles'
import BrandLogo from '../theme/BrandLogo'

const HomeNavbar = () => {
  return (
    <Flex as="nav" {...navStyles.wrapper}>
      <Box {...navStyles.brandLink}>
        <BrandLogo href="#top" />
      </Box>

      <HStack as="ul" {...navStyles.linkList} spacing={{ base: 5, md: 8 }}>
        {navLinks.map((item) => (
          <Box as="li" key={item.href} listStyleType="none">
            <ChakraLink href={item.href} {...navStyles.link}>
              {item.label}
            </ChakraLink>
          </Box>
        ))}
      </HStack>
    </Flex>
  )
}

export default HomeNavbar
