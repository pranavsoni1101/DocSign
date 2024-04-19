import React, { ReactNode, useState } from 'react'
import {
  IconButton,
  Box,
  CloseButton,
  Select,
  Flex,
  Icon,
  useColorModeValue,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
} from '@chakra-ui/react'
import {
  FiPhone,
  FiCalendar,
  FiMenu,
  FiPenTool
} from 'react-icons/fi'
import { FaSignature, FaRegEnvelope, FaDownload } from "react-icons/fa6";

const LinkItems = [
  { name: 'Signature', icon: FaSignature },
  // { name: 'Date Signed', icon: FiCalendar },
  // { name: 'Name', icon: FiPenTool },
  // { name: 'Email', icon: FaRegEnvelope },
  // { name: 'Contact', icon: FiPhone },
  // { name: 'Download Pdf', icon: FaDownload },
]

export default function Sidebar({ children, toggleDrag ,handleAddInputField, selectOptions, selectValue,handleSelectState}) {
  // console.log("sidebar",toggleDrag);
  // const handleToggleDrag = () => toggleDrag();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <SidebarContent 
        onClose={() => onClose} 
        display={{ base: 'none', md: 'block' }} 
        handleAddInputField={handleAddInputField} 
        handleSelectState = {handleSelectState}
        selectValue={selectValue}
        selectOptions={selectOptions}
      />
      <Drawer
        isOpen={isOpen}
        isFullHeight={true}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full">
        <DrawerContent>
          <SidebarContent onClose={onClose} toggleDrag={toggleDrag} handleAddInputField={handleAddInputField} handleSelectState = {handleSelectState} selectValue={selectValue} selectOptions={selectOptions}/>
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav display={{ base: 'flex', md: 'none' }} onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  )
}


const SidebarContent = ({ onClose, toggleDrag, selectOptions,selectValue,handleSelectState,handleAddInputField,...rest }) => {
  return (
    <Box
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}>
        
      <Box px = "10px">
        <Text
          fontWeight= "600"
          mt = "1em"
        >
          Select Signer
        </Text>
        <Select my="1em" variant= "filled" onChange={handleSelectState} isDisabled = {selectOptions.length >1? false: true}>
          {selectOptions.map(option => (
            <option key={option.email} value={option.email}>{option.email}</option>
          ))}
        </Select>
      </Box>  
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="xl" fontWeight="bold">
          Standard Fields
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon}
          handleAddInputField={handleAddInputField}
          selectValue = {selectValue}
        >
          {link.name}
        </NavItem>
      ))}
    </Box>
  )
}

const NavItem = ({ icon, handleAddInputField, dragEnabled, selectValue,children, ...rest }) => {
  console.log("Select value change?", selectValue);
  return (
    <Box
      onClick={() => handleAddInputField(selectValue)}
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'cyan.400',
          color: 'white',
        }}
        {...rest}>
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Box>
  )
}

const MobileNav = ({ onOpen, ...rest }) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent="flex-start"
      {...rest}>
      <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text fontSize="2xl" ml="8" fontFamily="monospace" fontWeight="bold">
        Logo
      </Text>
    </Flex>
  )
}