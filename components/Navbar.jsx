import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  Link,
} from '@chakra-ui/react'
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@chakra-ui/icons'
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export default function WithSubnavigation() {
  const { isOpen, onToggle } = useDisclosure();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
console.log(isLoggedIn);
  useEffect(() => {
    console.log("Initial run");
    const token = Cookies.get('jwt');
    if(token){
      setIsLoggedIn(prevLoggedIn => {
        if (!prevLoggedIn) {
            return true;
        }
        return prevLoggedIn;
    });
    }
  }, [])

  const handleSignOut = () => {
    // sessionStorage.removeItem('token');
    Cookies.remove("jwt");
    setIsLoggedIn(false);
    console.log("Logged Out");
    history.go("/");
  }
  return (
    <Box>
      <Flex
        bg="primary.500"
        color={"gray.100"}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={"gray.100"}
        align={'center'}>
        <Flex
          flex={{ base: 1, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}>
          <IconButton
            onClick={onToggle}
            color= "primary.500"
            icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
            _hover={{
              backgroundColor: "primary.500",
              color: "gray.500"
            }}
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
          <Text
            as={Link}
            href='/'
            fontWeight="bold"
            textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
            color="#fff"
            letterSpacing= "1px"
            textDecoration="none"
            _hover={{
              textDecoration: "none"
            }}
          >

            DocSign
          </Text>

            {isLoggedIn ?
              <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
                <DesktopNav />
              </Flex>
              :
              null
            }
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={'flex-end'}
          direction={'row'}
          spacing={6}>
          {!isLoggedIn ?
            <>
              <Button 
                as={Link} 
                fontSize={'sm'} 
                variant={'ghost'} 
                href={'/login'}
                // colorScheme='primary'
                color= "#FFF"
                textDecoration= "none"
                // borderColor= "primary.500"
                // color= "primary.500"
                _hover={{
                  backgroundColor: "primary.200",
                  color: "primary.600",
                  textDecoration: "none"
                }}
              >
                Log In
              </Button>
              <Button
                as={Link}
                display={{ base: 'none', md: 'inline-flex' }}
                fontSize={'sm'}
                fontWeight={600}
                color={'white'}
                bg={'primary.500'}
                href={'/signup'}
                _hover={{
                  textDecoration: "none",
                  bg: 'primary.600',
                  color: "white"
                }}>
                Sign Up
              </Button>
            </> :
            <>
              <Button
                onClick={handleSignOut}
                variant={"ghost"}
                // backgroundColor= "gray.200"
                // colorScheme='gray'
                color= "gray.500"
                backgroundColor= "primary.200"
                _hover={{
                  backgroundColor: "primary.300",
                  color: "#fff"
                }}
              >
                Log Out</Button>
            </>
          }
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  )
}

const DesktopNav = () => {
  const linkColor = "#fff"
  const linkHoverColor = "gray.100"
  // const popoverContentBgColor = useColorModeValue('white', 'gray.800')

  return (
    <Stack direction={'row'} spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          {/* <Popover trigger={'hover'} placement={'bottom-start'}>
            <PopoverTrigger> */}
          <Box
            position="relative"
          >
            <Text
              as="a"
              p={2}
              href={navItem.href ?? '#'}
              fontSize={'sm'}
              fontWeight={500}
              color={linkColor}
              _after={{
                content: '""',
                position: "absolute",
                width: "100%",
                transform: "scaleX(0)",
                height: "3px",
                bottom: 0,
                left: 0,
                backgroundColor: "white",
                transformOrigin: "bottom right",
                transition: "transform 0.25s ease-out",
              }}
              _hover={{
                textDecoration: 'none',
                color: linkHoverColor,
                _after: {
                  transform: "scaleX(1)",
                  transformOrigin: "bottom left"
                }
              }}
            >
              {navItem.label}
            </Text>
          </Box>
          {/* </PopoverTrigger> */}

          {/* {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={'xl'}
                bg={popoverContentBgColor}
                p={4}
                rounded={'xl'}
                minW={'sm'}>
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )} */}
          {/* </Popover> */}
        </Box>
      ))}
    </Stack>
  )
}

const DesktopSubNav = ({ label, href, subLabel }) => {
  return (
    <Box
      as="a"
      href={href}
      role={'group'}
      display={'block'}
      p={2}
      rounded={'md'}
      _hover={{ bg: useColorModeValue('pink.50', 'gray.900') }}>
      <Stack direction={'row'} align={'center'}>
        <Box>
          <Text
            transition={'all .3s ease'}
            _groupHover={{ color: 'pink.400' }}
            fontWeight={500}>
            {label}
          </Text>
          <Text fontSize={'sm'}>{subLabel}</Text>
        </Box>
        <Flex
          transition={'all .3s ease'}
          transform={'translateX(-10px)'}
          opacity={0}
          _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
          justify={'flex-end'}
          align={'center'}
          flex={1}>
          <Icon color={'pink.400'} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Box>
  )
}

const MobileNav = () => {
  return (
    <Stack bg="gray.500 " p={4} display={{ md: 'none' }}>
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  )
}

const MobileNavItem = ({ label, children, href }) => {
  const { isOpen, onToggle } = useDisclosure()

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Box
        py={2}
        as="a"
        href={href ?? '#'}
        justifyContent="space-between"
        alignItems="center"
        _hover={{
          textDecoration: 'none',
        }}>
        <Text fontWeight={600} color="primary.500">
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={'all .25s ease-in-out'}
            transform={isOpen ? 'rotate(180deg)' : ''}
            w={6}
            h={6}
          />
        )}
      </Box>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          align={'start'}>
          {children &&
            children.map((child) => (
              <Box as="a" key={child.label} py={2} href={child.href}>
                {child.label}
              </Box>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  )
}

const NAV_ITEMS = [
  // {
  //   label: 'Inspiration',
  //   children: [
  //     {
  //       label: 'Explore Design Work',
  //       subLabel: 'Trending Design to inspire you',
  //       href: '#',
  //     },
  //     {
  //       label: 'New & Noteworthy',
  //       subLabel: 'Up-and-coming Designers',
  //       href: '#',
  //     },
  //   ],
  // },
  {
    label: 'Create Envelope',
    href: '/createEnvelope',
  },
  // {
  //   label: 'Dashboard',
  //   href: '/dashboard',
  // },
  // {
  //   label: 'Pending Docs',
  //   href: '/pendingDocs',
  // },
  {
    label: 'Profile',
    href: '/profile',
  },
]